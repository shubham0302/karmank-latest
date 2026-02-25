import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import LocationSearchInput from "../LocationSearchInput";

// ─── Time helpers ────────────────────────────────────────────────────────────

/** Parse a 24-hour "HH:MM" string into { hour12, minute, period } */
function parse24h(value) {
  const m = (value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return { hour12: "12", minute: "00", period: "AM" };
  let h = parseInt(m[1], 10);
  const min = m[2];
  const period = h < 12 ? "AM" : "PM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { hour12: String(h), minute: min, period };
}

/** Convert { hour12, minute, period } back to 24-hour "HH:MM" */
function to24h({ hour12, minute, period }) {
  let h = parseInt(hour12, 10);
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, "0")}:${minute}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

// ─── Component ───────────────────────────────────────────────────────────────

export default function FamilyMemberForm({
  onSubmit,
  loading = false,
  defaultValues = {},
  currentMemberCount = 0,
  submitButtonText = "Save Member",
}) {
  const [formData, setFormData] = useState({
    name: defaultValues.name || "",
    gender: defaultValues.gender || "",
    date_of_birth: defaultValues.date_of_birth || "",
    birth_place: defaultValues.birth_place || "",
    latitude: defaultValues.latitude || null,
    longitude: defaultValues.longitude || null,
    timezone: defaultValues.timezone || "",
    birth_time: defaultValues.birth_time || "",
    relationship:
      defaultValues.relationship ||
      (currentMemberCount === 0 ? "self" : "other"),
  });

  // Separate AM/PM picker state (derived from birth_time on init)
  const [timePicker, setTimePicker] = useState(() =>
    parse24h(defaultValues.birth_time || "")
  );
  // Whether the user has touched the time picker at all
  const [timeSet, setTimeSet] = useState(!!(defaultValues.birth_time));

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (dobDate > today) {
        newErrors.date_of_birth = "Birth date cannot be in the future";
      }
      const year = dobDate.getFullYear();
      if (year < 1920 || year > today.getFullYear()) {
        newErrors.date_of_birth =
          "Please enter a valid birth year (1920 onwards)";
      }
    }

    if (!formData.birth_place.trim()) {
      newErrors.birth_place = "Birth place is required";
    } else if (formData.birth_place.length < 2) {
      newErrors.birth_place = "Birth place must be at least 2 characters";
    } else if (formData.birth_place.length > 200) {
      newErrors.birth_place = "Birth place must not exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationChange = (displayName, lat, lng, tz) => {
    setFormData((prev) => ({
      ...prev,
      birth_place: displayName || "",
      latitude: lat,
      longitude: lng,
      timezone: tz || prev.timezone,
    }));
    if (errors.birth_place) {
      setErrors((prev) => ({ ...prev, birth_place: "" }));
    }
  };

  const handleTimeChange = (field, value) => {
    const next = { ...timePicker, [field]: value };
    setTimePicker(next);
    setTimeSet(true);
    setFormData((prev) => ({ ...prev, birth_time: to24h(next) }));
  };

  const handleClearTime = () => {
    setTimeSet(false);
    setTimePicker({ hour12: "12", minute: "00", period: "AM" });
    setFormData((prev) => ({ ...prev, birth_time: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const selectClass =
    "bg-white/5 border border-white/10 text-white rounded-md px-2 py-2 text-sm focus:outline-none focus:border-cyan-400/50 disabled:opacity-50 cursor-pointer appearance-none text-center";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white font-medium">
          Full Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className={`bg-white/5 border ${
            errors.name ? "border-red-500/50" : "border-white/10"
          } text-white placeholder:text-white/40 focus:border-cyan-400/50`}
        />
        {errors.name && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.name}
          </motion.div>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <Label className="text-white font-medium">
          Gender <span className="text-red-400">*</span>
        </Label>
        <div className="flex gap-4">
          {[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={formData.gender === option.value}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="text-white">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.gender}
          </motion.div>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="date_of_birth" className="text-white font-medium">
          Date of Birth <span className="text-red-400">*</span>
        </Label>
        <Input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
          disabled={loading}
          className={`bg-white/5 border ${
            errors.date_of_birth ? "border-red-500/50" : "border-white/10"
          } text-white focus:border-cyan-400/50`}
        />
        {errors.date_of_birth && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.date_of_birth}
          </motion.div>
        )}
      </div>

      {/* Birth Place */}
      <div className="space-y-2">
        <Label htmlFor="birth_place" className="text-white font-medium">
          Birth Place <span className="text-red-400">*</span>
        </Label>
        <LocationSearchInput
          value={formData.birth_place}
          onChange={handleLocationChange}
          disabled={loading}
          error={errors.birth_place}
          placeholder="Search city or location..."
          inputClassName={`bg-white/5 border ${
            errors.birth_place ? "border-red-500/50" : "border-white/10"
          } text-white placeholder:text-white/40 focus:border-cyan-400/50`}
          dropdownClassName="bg-gray-900/95 border-white/10 backdrop-blur-sm"
        />
        {formData.latitude && formData.longitude && (
          <p className="text-xs text-cyan-400/60 flex items-center gap-1">
            <span>Coordinates saved:</span>
            <span>{Number(formData.latitude).toFixed(4)}°,</span>
            <span>{Number(formData.longitude).toFixed(4)}°</span>
            {formData.timezone && (
              <span className="text-white/30 ml-1">· {formData.timezone}</span>
            )}
          </p>
        )}
        {errors.birth_place && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.birth_place}
          </motion.div>
        )}
      </div>

      {/* Birth Time — AM/PM picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-white font-medium">
            Birth Time
            <span className="text-white/50 font-normal ml-2">(Optional)</span>
          </Label>
          {timeSet && (
            <button
              type="button"
              onClick={handleClearTime}
              disabled={loading}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Hour */}
          <select
            value={timePicker.hour12}
            onChange={(e) => handleTimeChange("hour12", e.target.value)}
            disabled={loading}
            className={`${selectClass} w-16`}
          >
            {HOURS.map((h) => (
              <option key={h} value={h} className="bg-gray-900">
                {h.padStart(2, "0")}
              </option>
            ))}
          </select>

          <span className="text-white/60 font-semibold text-lg">:</span>

          {/* Minute */}
          <select
            value={timePicker.minute}
            onChange={(e) => handleTimeChange("minute", e.target.value)}
            disabled={loading}
            className={`${selectClass} w-16`}
          >
            {MINUTES.map((m) => (
              <option key={m} value={m} className="bg-gray-900">
                {m}
              </option>
            ))}
          </select>

          {/* AM / PM toggle */}
          <div className="flex rounded-md overflow-hidden border border-white/10 ml-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                disabled={loading}
                onClick={() => handleTimeChange("period", p)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  timePicker.period === p
                    ? "bg-cyan-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Preview in 24h for clarity */}
          {timeSet && (
            <span className="text-xs text-white/30 ml-1">
              ({formData.birth_time})
            </span>
          )}
        </div>

        <p className="text-xs text-white/50">
          Optional but recommended for accurate chart calculations
        </p>
      </div>

      {/* Info Text */}
      <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
        <p className="text-cyan-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Start by adding your details. You can add more family members later
            from your Profile page.
          </span>
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 shadow-lg hover:shadow-cyan-500/50"
      >
        {loading ? "Saving..." : submitButtonText}
      </Button>
    </motion.form>
  );
}

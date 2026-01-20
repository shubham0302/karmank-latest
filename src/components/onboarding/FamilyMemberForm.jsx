import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function FamilyMemberForm({
  onSubmit,
  loading = false,
  defaultValues = {},
  currentMemberCount = 0,
}) {
  const [formData, setFormData] = useState({
    name: defaultValues.name || "",
    gender: defaultValues.gender || "",
    date_of_birth: defaultValues.date_of_birth || "",
    birth_place: defaultValues.birth_place || "",
    birth_time: defaultValues.birth_time || "",
    relationship:
      defaultValues.relationship ||
      (currentMemberCount === 0 ? "self" : "other"),
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // DOB validation
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

    // Birth place validation
    if (!formData.birth_place.trim()) {
      newErrors.birth_place = "Birth place is required";
    } else if (formData.birth_place.length < 2) {
      newErrors.birth_place = "Birth place must be at least 2 characters";
    } else if (formData.birth_place.length > 100) {
      newErrors.birth_place = "Birth place must not exceed 100 characters";
    }

    // Birth time validation (optional, but validate if provided)
    if (formData.birth_time) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.birth_time)) {
        newErrors.birth_time = "Please enter time in HH:MM format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

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
          {["Male", "Female", "Other"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="gender"
                value={option}
                checked={formData.gender === option}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="text-white">{option}</span>
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
        <Input
          id="birth_place"
          name="birth_place"
          type="text"
          placeholder="City, region, or location"
          value={formData.birth_place}
          onChange={handleChange}
          disabled={loading}
          className={`bg-white/5 border ${
            errors.birth_place ? "border-red-500/50" : "border-white/10"
          } text-white placeholder:text-white/40 focus:border-cyan-400/50`}
        />
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

      {/* Birth Time */}
      <div className="space-y-2">
        <Label htmlFor="birth_time" className="text-white font-medium">
          Birth Time
          <span className="text-white/50 font-normal ml-2">(Optional)</span>
        </Label>
        <Input
          id="birth_time"
          name="birth_time"
          type="time"
          value={formData.birth_time}
          onChange={handleChange}
          disabled={loading}
          className={`bg-white/5 border ${
            errors.birth_time ? "border-red-500/50" : "border-white/10"
          } text-white focus:border-cyan-400/50`}
        />
        <p className="text-xs text-white/50">
          Optional but recommended for accuracy
        </p>
        {errors.birth_time && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            {errors.birth_time}
          </motion.div>
        )}
      </div>

      {/* Info Text */}
      <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3 mt-4">
        <p className="text-cyan-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Each member is saved individually. You can add 1, 2, or 3 members -
            it's your choice!
          </span>
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 shadow-lg hover:shadow-cyan-500/50"
      >
        {loading ? "Saving Member..." : "Save Member"}
      </Button>
    </motion.form>
  );
}

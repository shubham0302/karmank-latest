import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FuturisticCalendar } from '@/components/ui/futuristic-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Clock, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export interface BirthDataFormValue {
  name: string;
  birthDate: Date;
  birthTime: string;
  birthLocation: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface BirthDataFormProps {
  onSubmit?: (data: BirthDataFormValue) => void;
  onCalculate?: (data: BirthDataFormValue) => void;
  loading?: boolean;
  initialData?: {
    name: string;
    birthDate: Date;
    birthTime: string;
    birthLocation: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

// Common cities with coordinates
const CITIES = [
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Chennai, India', lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639, tz: 'Asia/Kolkata' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
];

const BirthDataForm = ({ onSubmit, onCalculate, loading = false, initialData }: BirthDataFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(initialData?.birthDate);
  const [birthTime, setBirthTime] = useState(initialData?.birthTime || '12:00');
  const [birthLocation, setBirthLocation] = useState(initialData?.birthLocation || '');
  const [latitude, setLatitude] = useState(initialData?.latitude || 0);
  const [longitude, setLongitude] = useState(initialData?.longitude || 0);
  const [timezone, setTimezone] = useState(initialData?.timezone || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Sync form state when initialData changes (e.g. profile data loaded async)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setBirthDate(initialData.birthDate);
      setBirthTime(initialData.birthTime || '12:00');
      setBirthLocation(initialData.birthLocation || '');
      setLatitude(initialData.latitude || 0);
      setLongitude(initialData.longitude || 0);
      setTimezone(initialData.timezone || '');
    }
  }, [initialData]);

  const filteredCities = CITIES.filter(city =>
    city.name.toLowerCase().includes(birthLocation.toLowerCase())
  );

  // Geocoding search function
  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (birthLocation.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(birthLocation);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [birthLocation]);

  const handleCitySelect = (city: typeof CITIES[0]) => {
    setBirthLocation(city.name);
    setLatitude(city.lat);
    setLongitude(city.lng);
    setTimezone(city.tz);
    setShowSuggestions(false);
  };

  const handleSearchResultSelect = (result: any) => {
    setBirthLocation(result.display_name);
    setLatitude(parseFloat(result.lat));
    setLongitude(parseFloat(result.lon));

    // Estimate timezone based on longitude (rough approximation)
    const estimatedTz = getTimezoneFromCoordinates(parseFloat(result.lat), parseFloat(result.lon));
    setTimezone(estimatedTz);

    setShowSuggestions(false);
    setSearchResults([]);
  };

  // Simple timezone estimation based on longitude
  const getTimezoneFromCoordinates = (lat: number, lng: number): string => {
    // Check if coordinates match known cities first
    const knownCity = CITIES.find(
      city => Math.abs(city.lat - lat) < 0.5 && Math.abs(city.lng - lng) < 0.5
    );
    if (knownCity) return knownCity.tz;

    // Rough timezone estimation (UTC offset based on longitude)
    const offset = Math.round(lng / 15);
    if (offset >= 5 && offset <= 6) return 'Asia/Kolkata';
    if (offset >= 0 && offset <= 1) return 'Europe/London';
    if (offset >= -5 && offset <= -4) return 'America/New_York';
    if (offset >= -8 && offset <= -7) return 'America/Los_Angeles';
    if (offset >= 10 && offset <= 11) return 'Australia/Sydney';
    if (offset >= 3 && offset <= 4) return 'Asia/Dubai';

    return 'UTC';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const payload: BirthDataFormValue = {
      name,
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      timezone,
    };

    // Support both legacy and new callback names
    if (onSubmit) onSubmit(payload);
    if (onCalculate) onCalculate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">Chart Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="e.g., My Birth Chart"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-input border-border"
            required
          />
        </div>
      </div>

      {/* Birth Date */}
      <div className="space-y-2">
        <Label className="text-foreground">Birth Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-input border-border hover:bg-muted"
            >
              <CalendarIcon className="mr-3 h-4 w-4 text-muted-foreground" />
              {birthDate ? format(birthDate, 'PPP') : <span className="text-muted-foreground">Select birth date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-transparent border-0" align="start">
            <FuturisticCalendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Birth Time */}
      <div className="space-y-2">
        <Label htmlFor="birthTime" className="text-foreground">Birth Time</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="birthTime"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="pl-10 bg-input border-border"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">Accurate birth time improves chart precision</p>
      </div>

      {/* Birth Location */}
      <div className="space-y-2 relative">
        <Label htmlFor="birthLocation" className="text-foreground">Birth Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="birthLocation"
            placeholder="Search city..."
            value={birthLocation}
            onChange={(e) => {
              setBirthLocation(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 bg-input border-border"
            required
          />
        </div>
        
        {/* City suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-auto">
            {isSearching && (
              <div className="px-4 py-3 flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching locations...
              </div>
            )}

            {/* Popular cities first */}
            {filteredCities.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                  POPULAR CITIES
                </div>
                {filteredCities.map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{city.name}</span>
                  </button>
                ))}
              </>
            )}

            {/* Search results */}
            {!isSearching && searchResults.length > 0 && (
              <>
                {filteredCities.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-t border-border">
                    SEARCH RESULTS
                  </div>
                )}
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSearchResultSelect(result)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="line-clamp-2">{result.display_name}</span>
                  </button>
                ))}
              </>
            )}

            {!isSearching && searchResults.length === 0 && filteredCities.length === 0 && birthLocation.length >= 3 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No locations found. Try a different search.
              </div>
            )}
          </div>
        )}
        
        {latitude !== 0 && longitude !== 0 && (
          <p className="text-xs text-muted-foreground">
            Coordinates: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || !birthDate || !birthLocation || latitude === 0}
        className="w-full btn-cosmic text-primary-foreground font-semibold py-5"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Calculating...
          </>
        ) : (
          'Generate Birth Chart'
        )}
      </Button>
    </form>
  );
};

export default BirthDataForm;

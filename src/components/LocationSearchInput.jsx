import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { Input } from './ui/input'

const CITIES = [
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Chennai, India', lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639, tz: 'Asia/Kolkata' },
  { name: 'Hyderabad, India', lat: 17.3850, lng: 78.4867, tz: 'Asia/Kolkata' },
  { name: 'Pune, India', lat: 18.5204, lng: 73.8567, tz: 'Asia/Kolkata' },
  { name: 'Jaipur, India', lat: 26.9124, lng: 75.7873, tz: 'Asia/Kolkata' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto' },
]

export { CITIES }

function getTimezoneFromCoordinates(lat, lng) {
  // Check known cities first (within ~55km)
  const knownCity = CITIES.find(
    city => Math.abs(city.lat - lat) < 0.5 && Math.abs(city.lng - lng) < 0.5
  )
  if (knownCity) return knownCity.tz

  // Rough timezone estimation from longitude
  const offset = Math.round(lng / 15)
  if (offset >= 5 && offset <= 6) return 'Asia/Kolkata'
  if (offset === 0 || offset === 1) return 'Europe/London'
  if (offset >= -5 && offset <= -4) return 'America/New_York'
  if (offset >= -8 && offset <= -7) return 'America/Los_Angeles'
  if (offset >= 10 && offset <= 11) return 'Australia/Sydney'
  if (offset >= 3 && offset <= 4) return 'Asia/Dubai'
  if (offset === 8) return 'Asia/Singapore'
  if (offset === 9) return 'Asia/Tokyo'

  return 'UTC'
}

export { getTimezoneFromCoordinates }

export default function LocationSearchInput({
  value = '',
  onChange,
  disabled = false,
  error = '',
  placeholder = 'Search city...',
  inputClassName = '',
  dropdownClassName = '',
}) {
  const [query, setQuery] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)
  const containerRef = useRef(null)

  // Sync external value changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced Nominatim search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (query.length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
            { headers: { 'User-Agent': 'KarmAnk/1.0' } }
          )
          const data = await response.json()
          setSearchResults(data)
        } catch (err) {
          console.error('Location search error:', err)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 500)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [query])

  const filteredCities = CITIES.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleCitySelect = (city) => {
    setQuery(city.name)
    setShowSuggestions(false)
    setSearchResults([])
    onChange(city.name, city.lat, city.lng, city.tz)
  }

  const handleSearchResultSelect = (result) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    const tz = getTimezoneFromCoordinates(lat, lng)
    const displayName = result.display_name

    setQuery(displayName)
    setShowSuggestions(false)
    setSearchResults([])
    onChange(displayName, lat, lng, tz)
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
    // If user types manually (clearing geocoded data), notify parent with nulls
    onChange(e.target.value, null, null, null)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          disabled={disabled}
          className={`pl-10 ${inputClassName}`}
        />
      </div>

      {showSuggestions && (query.length > 0 || filteredCities.length > 0) && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-64 overflow-auto border ${
          dropdownClassName || 'bg-gray-900 border-white/10'
        }`}>
          {isSearching && (
            <div className="px-4 py-3 flex items-center gap-2 text-white/50 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching locations...
            </div>
          )}

          {filteredCities.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-white/40 border-b border-white/10">
                POPULAR CITIES
              </div>
              {filteredCities.slice(0, 6).map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors text-sm text-white flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                  <span>{city.name}</span>
                </button>
              ))}
            </>
          )}

          {!isSearching && searchResults.length > 0 && (
            <>
              {filteredCities.length > 0 && (
                <div className="px-4 py-2 text-xs font-semibold text-white/40 border-b border-t border-white/10">
                  SEARCH RESULTS
                </div>
              )}
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSearchResultSelect(result)}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors text-sm text-white flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" />
                  <span className="line-clamp-2">{result.display_name}</span>
                </button>
              ))}
            </>
          )}

          {!isSearching && searchResults.length === 0 && filteredCities.length === 0 && query.length >= 3 && (
            <div className="px-4 py-3 text-sm text-white/50">
              No locations found. Try a different search.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

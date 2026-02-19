/**
 * Project Aether API Client
 * High-precision Swiss Ephemeris calculations via backend API
 */

const API_BASE_URL = import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000';

export interface AyanamsaInfo {
  code: string;
  name: string;
  description: string;
  recommended_for: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  location_type: string;
  place_id?: string;
}

export interface TimezoneResult {
  timezone_id: string;
  timezone_name: string;
  total_offset_hours: number;
  utc_offset_string: string;
  confidence: string;
  is_historical: boolean;
  notes: string[];
}

export interface PlanetPosition {
  longitude_tropical: number;
  longitude_sidereal: number;
  latitude: number;
  distance: number;
  speed: number;
  sign_num: number;
  sign_name: string;
  degree_in_sign: number;
  nakshatra_num: number;
  nakshatra_name: string;
  nakshatra_pada: number;
  is_retrograde: boolean;
}

export interface BirthChartData {
  calculation_metadata: {
    julian_day: number;
    delta_t_seconds: number;
    ayanamsa_type: string;
    ayanamsa_degrees: number;
    node_type: string;
    house_system: string;
    ephemeris: string;
    calculation_time: string;
  };
  ascendant: {
    degree: number;
    sign_num: number;
    sign_name: string;
    degree_in_sign: number;
  };
  moon_sign: string;
  sun_sign: string;
  planets: Record<string, PlanetPosition>;
  houses: number[];
}

export interface CalculateChartRequest {
  birth_date: string;  // YYYY-MM-DD
  birth_time: string;  // HH:MM
  latitude: number;
  longitude: number;
  timezone_id: string;
  ayanamsa?: string;    // Default: LAHIRI
  node_type?: string;   // Default: MEAN
  house_system?: string; // Default: P
}

class AetherApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; swiss_ephemeris: string; google_maps: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    if (!response.ok) {
      throw new Error('API health check failed');
    }
    return response.json();
  }

  /**
   * List all supported Ayanamsa systems
   */
  async getAyanamsas(): Promise<{ ayanamsas: AyanamsaInfo[] }> {
    const response = await fetch(`${this.baseUrl}/api/ayanamsas`);
    if (!response.ok) {
      throw new Error('Failed to fetch Ayanamsa systems');
    }
    return response.json();
  }

  /**
   * Convert location string to precise coordinates
   */
  async geocodeLocation(location: string): Promise<GeocodeResult> {
    const response = await fetch(`${this.baseUrl}/api/geocode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Geocoding failed');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Resolve timezone for coordinates with historical handling
   */
  async resolveTimezone(
    latitude: number,
    longitude: number,
    birthDate: string,
    birthTime: string
  ): Promise<TimezoneResult> {
    const response = await fetch(`${this.baseUrl}/api/timezone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        birth_date: birthDate,
        birth_time: birthTime,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Timezone resolution failed');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Calculate high-precision Vedic birth chart
   */
  async calculateChart(request: CalculateChartRequest): Promise<BirthChartData> {
    const response = await fetch(`${this.baseUrl}/api/calculate-chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Chart calculation failed');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Convenience method: Geocode location, resolve timezone, and calculate chart
   */
  async calculateChartFromLocation(
    location: string,
    birthDate: string,  // YYYY-MM-DD
    birthTime: string,  // HH:MM
    ayanamsa: string = 'LAHIRI',
    nodeType: string = 'MEAN',
    houseSystem: string = 'P'
  ): Promise<{
    chart: BirthChartData;
    location: GeocodeResult;
    timezone: TimezoneResult;
  }> {
    // Step 1: Geocode location
    const locationData = await this.geocodeLocation(location);

    // Step 2: Resolve timezone
    const timezoneData = await this.resolveTimezone(
      locationData.latitude,
      locationData.longitude,
      birthDate,
      birthTime
    );

    // Step 3: Calculate chart
    const chartData = await this.calculateChart({
      birth_date: birthDate,
      birth_time: birthTime,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone_id: timezoneData.timezone_id,
      ayanamsa,
      node_type: nodeType,
      house_system: houseSystem,
    });

    return {
      chart: chartData,
      location: locationData,
      timezone: timezoneData,
    };
  }
}

// Export singleton instance
export const aetherApi = new AetherApiClient();

// Export class for custom instances
export default AetherApiClient;

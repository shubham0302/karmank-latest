import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/astrology/components/layout/Navbar';
import BirthDataForm from '@/astrology/components/birthchart/BirthDataForm';
import BirthChartDisplay from '@/astrology/components/birthchart/BirthChartDisplay';
import { calculateBirthChart, BirthChartData } from '@/astrology/lib/astrology';
import { useToast } from '@/astrology/hooks/use-toast';
import { useProfileBirthData } from '@/hooks/useProfileBirthData';
import FamilyMemberSelector from '@/components/FamilyMemberSelector';
import CosmicBackground from '@/components/CosmicBackground';
import { CITIES, getTimezoneFromCoordinates } from '@/components/LocationSearchInput';

interface SavedChart {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  chart_data: BirthChartData | null;
}

const BirthChart = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [savedChart, setSavedChart] = useState<SavedChart | null>(null);
  const [calculating, setCalculating] = useState(false);
  const { birthDataFormValue: profileData, isAstrologyReady } = useProfileBirthData();

  // Family member selector state
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberFormData, setMemberFormData] = useState<any>(null);

  useEffect(() => {
    const chartId = searchParams.get('id');
    if (chartId && user) {
      loadChart(chartId);
    }
  }, [searchParams, user]);

  const loadChart = async (chartId: string) => {
    const { data, error } = await supabase
      .from('birth_charts')
      .select('*')
      .eq('id', chartId)
      .single();

    if (!error && data) {
      setSavedChart(data as unknown as SavedChart);
      if (data.chart_data) {
        setChartData(data.chart_data as unknown as BirthChartData);
      }
    }
  };

  // When a family member is selected from the dropdown
  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  const handleMemberDetailsChange = (details: any) => {
    if (!details.dob) return;

    // Resolve coordinates — prefer DB coords, then try CITIES lookup
    let lat = details.latitude;
    let lng = details.longitude;
    let tz = details.timezone || '';

    if (!lat && !lng && details.birthPlace) {
      const city = CITIES.find(c =>
        c.name.toLowerCase().includes(details.birthPlace.toLowerCase()) ||
        details.birthPlace.toLowerCase().includes(c.name.split(',')[0].toLowerCase())
      );
      if (city) {
        lat = city.lat;
        lng = city.lng;
        tz = city.timezone;
      }
    }

    if (lat && lng && !tz) {
      tz = getTimezoneFromCoordinates(lat, lng);
    }

    setMemberFormData({
      name: details.name || '',
      birthDate: new Date(details.dob),
      birthTime: details.birthTime || '12:00',
      birthLocation: details.birthPlace || '',
      latitude: lat || 0,
      longitude: lng || 0,
      timezone: tz || 'Asia/Kolkata',
    });
  };

  const handleCalculate = async (formData: {
    name: string;
    birthDate: Date;
    birthTime: string;
    birthLocation: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    setCalculating(true);

    try {
      const chart = calculateBirthChart(
        formData.birthDate,
        formData.birthTime,
        formData.latitude,
        formData.longitude
      );

      setChartData(chart);

      // Save to database if user is logged in
      if (user) {
        const { data, error } = await supabase
          .from('birth_charts')
          .insert({
            user_id: user.id,
            name: formData.name,
            birth_date: formData.birthDate.toISOString().split('T')[0],
            birth_time: formData.birthTime,
            birth_location: formData.birthLocation,
            latitude: formData.latitude,
            longitude: formData.longitude,
            timezone: formData.timezone,
            chart_data: chart as any,
            is_primary: false,
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Chart Generated!',
          description: 'Your Vedic birth chart has been calculated and saved.',
        });

        if (data) {
          navigate(`/astrology/birth-chart?id=${data.id}`, { replace: true });
        }
      } else {
        toast({
          title: 'Chart Generated!',
          description: 'Your Vedic birth chart has been calculated.',
        });
      }
    } catch (error: any) {
      console.error('Error calculating chart:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate birth chart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCalculating(false);
    }
  };

  // Determine form initial data priority: savedChart > memberFormData > profileData
  const getFormInitialData = () => {
    if (savedChart) {
      return {
        name: savedChart.name,
        birthDate: new Date(savedChart.birth_date),
        birthTime: savedChart.birth_time,
        birthLocation: savedChart.birth_location,
        latitude: savedChart.latitude,
        longitude: savedChart.longitude,
        timezone: savedChart.timezone,
      };
    }
    if (memberFormData) return memberFormData;
    if (isAstrologyReady && profileData) return profileData;
    return undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />

      <main className="pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-white">
              Vedic <span className="text-gradient-gold">Birth Chart</span>
            </h1>
            <p className="text-white/60">
              Generate your personalized Kundli with precise planetary positions
            </p>
          </div>

          {/* Family Member Selector */}
          <div className="max-w-md mx-auto mb-8">
            <FamilyMemberSelector
              selectedMemberId={selectedMemberId}
              onMemberSelect={handleMemberSelect}
              onDetailsChange={handleMemberDetailsChange}
              label="Select Family Member"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="card-cosmic p-6">
              <h2 className="font-serif text-xl font-semibold mb-6 text-white">Birth Details</h2>
              {(isAstrologyReady || memberFormData) && !savedChart && (
                <div className="mb-4 px-3 py-2 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
                  <p className="text-emerald-300 text-xs">
                    {memberFormData ? 'Using selected family member data.' : 'Using your profile birth data.'}{' '}
                    Edit below if needed.
                  </p>
                </div>
              )}
              <BirthDataForm
                onSubmit={handleCalculate}
                loading={calculating}
                initialData={getFormInitialData()}
              />
            </div>

            {/* Chart Display */}
            <div className="card-cosmic p-6">
              <h2 className="font-serif text-xl font-semibold mb-6 text-white">Your Kundli</h2>
              <BirthChartDisplay chartData={chartData} />
            </div>
          </div>
        </div>
      </main>
    </CosmicBackground>
  );
};

export default BirthChart;

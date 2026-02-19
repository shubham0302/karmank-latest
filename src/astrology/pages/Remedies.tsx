/**
 * Remedies Page
 * Personalized Vedic astrology remedies based on birth chart analysis
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import RemediesCard from '@/astrology/components/remedies/RemediesCard';
import BirthDataForm from '@/astrology/components/birthchart/BirthDataForm';
import { getPersonalizedRemedies, formatBirthDataForAPI, type BirthData, type PersonalizedRemediesResponse } from '@/astrology/lib/api/astrology-api';

export default function Remedies() {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [remediesData, setRemediesData] = useState<PersonalizedRemediesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load birth data from localStorage if available
  useEffect(() => {
    const savedBirthData = localStorage.getItem('birthData');
    if (savedBirthData) {
      try {
        const data = JSON.parse(savedBirthData);
        setBirthData(data);
        fetchRemedies(data);
      } catch (e) {
        console.error('Failed to parse saved birth data:', e);
      }
    }
  }, []);

  const fetchRemedies = async (data: BirthData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPersonalizedRemedies(data);
      setRemediesData(result);
      localStorage.setItem('birthData', JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch remedies');
      console.error('Error fetching remedies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthDataSubmit = (formData: {
    name: string;
    birthDate: Date;
    birthTime: string;
    birthLocation: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    // Convert form data to API format
    const apiData = formatBirthDataForAPI(formData);
    setBirthData(apiData);
    fetchRemedies(apiData);
  };

  const handleRefresh = () => {
    if (birthData) {
      fetchRemedies(birthData);
    }
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-24 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-serif font-bold text-gradient-gold">
              Vedic Remedies
            </h1>
          </div>
          <p className="text-white/60 text-lg">
            Personalized remedies to strengthen planetary influences and overcome challenges
          </p>
        </div>

        {/* Birth Data Form or Results */}
        {!birthData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Your Birth Details</CardTitle>
              <CardDescription>
                We'll analyze your birth chart to provide personalized remedies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BirthDataForm onSubmit={handleBirthDataSubmit} loading={loading} />
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {/* Error State — API offline */}
        {error && (
          <div className="card-cosmic p-8 text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-white mb-2">Remedies Engine Offline</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Personalized remedy calculation requires the backend service, which is currently being set up.
              Birth Chart generation works offline.
            </p>
          </div>
        )}

        {/* Remedies Display */}
        {!loading && remediesData && birthData && (
          <div className="space-y-6">
            {/* Info Banner */}
            <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Your Personalized Remedies</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your birth chart from {remediesData.birth_date}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {remediesData.total_remedy_categories} planet{remediesData.total_remedy_categories > 1 ? 's' : ''} requiring attention
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Remedies Card Component */}
            <RemediesCard
              personalizedRemedies={remediesData.personalized_remedies}
              generalRemedies={remediesData.general_remedies}
              importantNote={remediesData.important_note}
            />

            {/* New Birth Data Button */}
            <div className="flex justify-center pt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setBirthData(null);
                  setRemediesData(null);
                  localStorage.removeItem('birthData');
                }}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Calculate for Different Birth Data
              </Button>
            </div>
          </div>
        )}

        {/* Educational Content */}
        {!birthData && !loading && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gemstones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Powerful gems to amplify beneficial planetary energies and protect from malefic influences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mantras</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sacred sounds and chants to harmonize with planetary vibrations and invoke divine blessings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Charity & Fasting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Selfless acts and disciplined practices to neutralize negative karmas and strengthen willpower.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CosmicBackground>
  );
}

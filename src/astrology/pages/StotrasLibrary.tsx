/**
 * Stotras Library Page
 * Comprehensive library of Vedic Stotras for all nine planets
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import {
  BookOpen,
  Sun,
  Moon,
  Flame,
  Sparkles,
  Star,
  Heart,
  Clock,
  Users,
  Gift,
  Volume2,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Search
} from 'lucide-react';
import { useToast } from '@/astrology/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000';

// Planet icon mapping
const planetIcons: Record<string, any> = {
  sun: Sun,
  moon: Moon,
  mars: Flame,
  mercury: Sparkles,
  jupiter: Star,
  venus: Heart,
  saturn: Clock,
  rahu: Moon,
  ketu: Star
};

// Planet color mapping
const planetColors: Record<string, string> = {
  sun: 'from-orange-500 to-yellow-500',
  moon: 'from-blue-300 to-slate-400',
  mars: 'from-red-500 to-orange-500',
  mercury: 'from-green-500 to-emerald-500',
  jupiter: 'from-yellow-400 to-amber-500',
  venus: 'from-pink-400 to-rose-500',
  saturn: 'from-slate-600 to-gray-700',
  rahu: 'from-indigo-600 to-purple-700',
  ketu: 'from-purple-500 to-violet-600'
};

interface StotraVerse {
  number: number;
  sanskrit: string;
  transliteration: string;
  meaning: string;
}

interface AudioLink {
  title: string;
  url: string;
  type: string;
}

interface Stotra {
  name: string;
  sanskrit_name: string;
  planet: string;
  planet_sanskrit: string;
  deity: string;
  origin: string;
  what_is_stotra: string;
  why_this_stotra: string;
  benefits: string[];
  who_should_recite: string[];
  best_time: string;
  ideal_count: string;
  duration: string;
  audio_links: AudioLink[];
  verses: StotraVerse[];
  complete_text_sanskrit: string;
  complete_transliteration: string;
}

interface StotraSummary {
  planet: string;
  name: string;
  sanskrit_name: string;
  deity: string;
  best_time: string;
}

export default function StotrasLibrary() {
  const [stotras, setStotras] = useState<StotraSummary[]>([]);
  const [selectedStotra, setSelectedStotra] = useState<Stotra | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStotra, setLoadingStotra] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    fullText: false,
    transliteration: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStotras();
  }, []);

  const fetchStotras = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stotras/`);
      if (!response.ok) throw new Error('Failed to fetch stotras');
      const data = await response.json();
      setStotras(data.stotras || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stotras');
    } finally {
      setLoading(false);
    }
  };

  const fetchStotraDetails = async (planet: string) => {
    setLoadingStotra(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/stotras/planet/${planet}`);
      if (!response.ok) throw new Error('Failed to fetch stotra details');
      const data = await response.json();
      setSelectedStotra(data.stotra);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to load stotra',
        variant: "destructive"
      });
    } finally {
      setLoadingStotra(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy manually",
        variant: "destructive"
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <CosmicBackground density={140} useVideo={true}>
        <Navbar />
        <div className="container mx-auto py-8 px-4 pt-24 relative z-10">
          <div className="card-cosmic p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-white mb-2">Stotras Library Offline</h3>
            <p className="text-white/60 max-w-md mx-auto">
              The Stotras library requires the backend service, which is currently being set up.
              Birth Chart generation works offline.
            </p>
          </div>
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-7xl pt-24 relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-purple-400" />
          <h1 className="text-4xl font-serif font-bold text-gradient-gold">
            Stotras Library
          </h1>
        </div>
        <p className="text-white/60 max-w-2xl mx-auto">
          Sacred hymns for planetary propitiation. Select a planet to view the complete stotra with
          Sanskrit text, transliteration, meaning, benefits, and audio guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planet Selection Grid */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5" />
                Select Planet
              </CardTitle>
              <CardDescription>
                Choose a planet to view its sacred stotra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stotras.map((stotra) => {
                const Icon = planetIcons[stotra.planet.toLowerCase()] || Star;
                const colorClass = planetColors[stotra.planet.toLowerCase()] || 'from-gray-500 to-slate-500';
                const isSelected = selectedStotra?.planet.toLowerCase() === stotra.planet.toLowerCase();

                return (
                  <button
                    key={stotra.planet}
                    onClick={() => fetchStotraDetails(stotra.planet.toLowerCase())}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                        : 'border-border hover:border-purple-300 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{stotra.name}</p>
                        <p className="text-xs text-muted-foreground">{stotra.planet} • {stotra.deity}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Stotra Details */}
        <div className="lg:col-span-2">
          {loadingStotra ? (
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : selectedStotra ? (
            <StotraDetails
              stotra={selectedStotra}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              copyToClipboard={copyToClipboard}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a Planet</h3>
                <p className="text-muted-foreground">
                  Choose a planet from the list to view its sacred stotra with complete details.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </CosmicBackground>
  );
}

// Stotra Details Component
function StotraDetails({
  stotra,
  expandedSections,
  toggleSection,
  copyToClipboard
}: {
  stotra: Stotra;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  copyToClipboard: (text: string, label: string) => void;
}) {
  const Icon = planetIcons[stotra.planet.toLowerCase()] || Star;
  const colorClass = planetColors[stotra.planet.toLowerCase()] || 'from-gray-500 to-slate-500';

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">{stotra.name}</h2>
                <Badge variant="secondary">{stotra.sanskrit_name}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {stotra.planet} ({stotra.planet_sanskrit}) • {stotra.deity}
              </p>
              <p className="text-sm mt-2 text-muted-foreground italic">
                Origin: {stotra.origin}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="text">Full Text</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                What is {stotra.name}?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{stotra.what_is_stotra}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Why This Stotra?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{stotra.why_this_stotra}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-muted-foreground">Best Time</p>
                <p className="text-sm font-medium">{stotra.best_time}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                <p className="text-xs text-muted-foreground">Ideal Count</p>
                <p className="text-sm font-medium">{stotra.ideal_count}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Volume2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{stotra.duration}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Full Text Tab */}
        <TabsContent value="text" className="space-y-4">
          {/* Sanskrit Text */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sanskrit Text (देवनागरी)</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(stotra.complete_text_sanskrit, 'Sanskrit text')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-serif text-lg leading-loose">
                  {stotra.complete_text_sanskrit}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Transliteration */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Transliteration (Roman)</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(stotra.complete_transliteration, 'Transliteration')}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-loose">
                  {stotra.complete_transliteration}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Verse by Verse */}
          {stotra.verses && stotra.verses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verse-by-Verse Meaning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stotra.verses.map((verse, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <Badge variant="outline" className="mb-2">Verse {verse.number}</Badge>
                    <div className="space-y-2">
                      <p className="font-serif text-lg">{verse.sanskrit}</p>
                      <p className="text-sm text-muted-foreground italic">{verse.transliteration}</p>
                      <Separator />
                      <p className="text-sm"><strong>Meaning:</strong> {verse.meaning}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Benefits of Recitation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stotra.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Who Should Recite?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stotra.who_should_recite.map((who, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm">{who}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio Tab */}
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-purple-600" />
                Audio & Pronunciation Guide
              </CardTitle>
              <CardDescription>
                Listen to traditional chanting to learn correct pronunciation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stotra.audio_links && stotra.audio_links.length > 0 ? (
                <div className="space-y-3">
                  {stotra.audio_links.map((audio, idx) => (
                    <a
                      key={idx}
                      href={audio.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{audio.title}</p>
                        <p className="text-xs text-muted-foreground">YouTube</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No audio links available</p>
              )}
            </CardContent>
          </Card>

          <Alert>
            <Volume2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Pronunciation Tips:</strong> Listen to the audio multiple times before attempting to chant.
              Start slowly and focus on correct pronunciation. Speed will come naturally with practice.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import { Button } from '@/components/ui/button';
import { Fingerprint, BookOpen, Upload, ChevronRight, Sparkles, Scroll } from 'lucide-react';

// 108 thumbprint types (simplified representation)
const THUMBPRINT_TYPES = [
  'Chakra', 'Padma', 'Shankha', 'Swastika', 'Trishula', 'Matsya', 
  'Kurma', 'Varaha', 'Narsimha', 'Vamana', 'Parashurama', 'Rama'
];

const KANDAMS = [
  { number: 1, name: 'General Kandam', description: 'Overview of life, personality, and general predictions' },
  { number: 2, name: 'Family & Wealth', description: 'Family relationships, accumulated wealth, and speech' },
  { number: 3, name: 'Siblings & Courage', description: 'Brothers, sisters, valor, and short journeys' },
  { number: 4, name: 'Mother & Property', description: 'Mother, home, vehicles, and land ownership' },
  { number: 5, name: 'Children & Education', description: 'Progeny, creativity, education, and intelligence' },
  { number: 6, name: 'Health & Enemies', description: 'Diseases, debts, obstacles, and competitors' },
  { number: 7, name: 'Marriage & Partnership', description: 'Spouse, marriage life, and business partnerships' },
  { number: 8, name: 'Longevity & Transformation', description: 'Lifespan, sudden events, and spiritual transformation' },
  { number: 9, name: 'Fortune & Dharma', description: 'Luck, father, higher learning, and spiritual practices' },
  { number: 10, name: 'Career & Status', description: 'Profession, reputation, and achievements' },
  { number: 11, name: 'Gains & Aspirations', description: 'Income, friendships, and fulfillment of desires' },
  { number: 12, name: 'Liberation & Loss', description: 'Spiritual liberation, foreign travel, and expenditures' },
];

const NadiShastra = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedKandam, setSelectedKandam] = useState<number | null>(null);

  // DISABLED: Allow guest access to Nadi Shastra
  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate('/');
  //   }
  // }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />

      <main className="pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-gold">Nadi Shastra</span>
            </h1>
            <p className="text-muted-foreground">
              Ancient palm-leaf manuscripts containing your destiny
            </p>
          </div>

          {/* Introduction */}
          {step === 0 && (
            <div className="space-y-8 animate-fade-in">
              <div className="card-cosmic p-8 text-center">
                <Scroll className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="font-display text-2xl font-semibold mb-4">The Ancient Science of Destiny</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                  Nadi Shastra is a mystical form of Hindu astrology practiced in Tamil Nadu, India. 
                  It is based on the belief that ancient sages, particularly Agastya, recorded the 
                  destinies of every soul on palm leaves thousands of years ago. These leaves are 
                  identified through your unique thumbprint pattern.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <Fingerprint className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">108 Types</h3>
                    <p className="text-sm text-muted-foreground">Thumbprints are classified into 108 categories</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">12 Kandams</h3>
                    <p className="text-sm text-muted-foreground">Each leaf contains 12 chapters of life</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Divine Wisdom</h3>
                    <p className="text-sm text-muted-foreground">Predictions written by enlightened sages</p>
                  </div>
                </div>
                <Button onClick={() => setStep(1)} className="btn-cosmic text-primary-foreground">
                  Begin Your Journey
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Thumbprint Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-cosmic p-8">
                <h2 className="font-display text-xl font-semibold mb-2 text-center">Thumbprint Classification</h2>
                <p className="text-muted-foreground text-center mb-8">
                  In a real Nadi reading, your thumbprint is scanned and matched. 
                  For this demonstration, select a symbolic pattern.
                </p>
                
                {/* Simulated thumbprint upload */}
                <div className="flex justify-center mb-8">
                  <div className="w-40 h-40 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/20 cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Thumbprint</span>
                    <span className="text-xs text-muted-foreground">(Demo Only)</span>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mb-4">Or select a pattern type:</p>
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {THUMBPRINT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-lg border transition-all text-center ${
                        selectedType === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Fingerprint className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm">{type}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!selectedType}
                    className="btn-cosmic text-primary-foreground"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Kandam Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-cosmic p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Fingerprint className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Pattern</p>
                    <p className="font-display text-lg font-semibold text-primary">{selectedType}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your thumbprint pattern, several palm leaves may match. 
                  A Nadi reader would ask verification questions to find your exact leaf.
                </p>
              </div>

              <div className="card-cosmic p-8">
                <h2 className="font-display text-xl font-semibold mb-2 text-center">The 12 Kandams (Chapters)</h2>
                <p className="text-muted-foreground text-center mb-8">
                  Each palm leaf contains 12 chapters covering different aspects of life.
                  Select a Kandam to learn more.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {KANDAMS.map((kandam) => (
                    <button
                      key={kandam.number}
                      onClick={() => setSelectedKandam(kandam.number)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selectedKandam === kandam.number
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          selectedKandam === kandam.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {kandam.number}
                        </span>
                        <div>
                          <h3 className={`font-semibold ${selectedKandam === kandam.number ? 'text-primary' : 'text-foreground'}`}>
                            {kandam.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{kandam.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={!selectedKandam}
                    className="btn-cosmic text-primary-foreground"
                  >
                    View Sample Reading
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Sample Reading */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="card-cosmic p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold mb-2">
                    Kandam {selectedKandam}: {KANDAMS.find(k => k.number === selectedKandam)?.name}
                  </h2>
                  <p className="text-muted-foreground">
                    Pattern: {selectedType}
                  </p>
                </div>

                <div className="bg-muted/30 border border-border/30 rounded-lg p-6 mb-6">
                  <p className="font-serif text-lg leading-relaxed text-foreground italic mb-4">
                    "In this sacred leaf inscribed by Sage Agastya in ancient times, 
                    the seeker of the {selectedType} lineage approaches during the time 
                    when Jupiter transits the house of wisdom..."
                  </p>
                  <p className="text-muted-foreground text-sm">
                    This is a demonstration. In an authentic Nadi reading, the reader would 
                    translate ancient Tamil verses specific to your exact birth details, 
                    revealing precise predictions about your past, present, and future.
                  </p>
                </div>

                <div className="bg-cosmic-gold/10 border border-cosmic-gold/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-foreground">
                    <strong className="text-primary">Note:</strong> Project Aether's full implementation 
                    would connect seekers with authentic Nadi readers who possess the original palm 
                    leaves, enabling remote readings while preserving this ancient tradition.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Start Over
                  </Button>
                  <Button onClick={() => navigate('/astrologer')} className="btn-cosmic text-primary-foreground">
                    Ask AI Astrologer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </CosmicBackground>
  );
};

export default NadiShastra;
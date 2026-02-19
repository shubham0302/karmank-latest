/**
 * Confidence Overview Component
 * Displays life area confidence scores with visual indicators
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Briefcase,
  Heart,
  DollarSign,
  Activity,
  GraduationCap,
  Home,
  Sparkles,
  Plane,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type {
  LifeOverviewResponse,
  CategoryConfidence,
  ConfidenceFactor,
  BirthData
} from '@/astrology/lib/api/astrology-api';
import { useCategoryTiming } from '@/astrology/hooks/useAstrologyAPI';
import TimingSection from './TimingSection';
import HealthDetailsCard from './HealthDetailsCard';

interface ConfidenceOverviewProps {
  data: LifeOverviewResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  birthData?: BirthData | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  career: Briefcase,
  relationships: Heart,
  wealth: DollarSign,
  health: Activity,
  education: GraduationCap,
  family: Home,
  spirituality: Sparkles,
  travel: Plane,
};

const categoryNames: Record<string, string> = {
  career: 'Career & Profession',
  relationships: 'Relationships & Marriage',
  wealth: 'Wealth & Prosperity',
  health: 'Health & Vitality',
  education: 'Education & Learning',
  family: 'Family & Home',
  spirituality: 'Spirituality & Growth',
  travel: 'Travel & Foreign',
};

// AI-powered one-liner insights based on confidence level and factors
function getAIInsight(categoryId: string, score: number, supportingCount: number, contradictingCount: number): string {
  const insights: Record<string, Record<string, string[]>> = {
    career: {
      high: [
        "Stars align for professional breakthroughs - your planetary positions favor leadership roles",
        "Strong dasha support indicates career advancement opportunities ahead",
        "Your chart shows exceptional potential for recognition and authority"
      ],
      medium: [
        "Steady progress indicated - focus on skill development during this period",
        "Mixed planetary influences suggest strategic patience in career moves",
        "Balance is key - opportunities will come through persistent effort"
      ],
      low: [
        "A period for reflection and skill-building rather than major changes",
        "Consider consolidating current position before seeking advancement",
        "Challenging transits suggest focusing on stability over expansion"
      ]
    },
    relationships: {
      high: [
        "Venus blesses your connections - harmonious partnerships are indicated",
        "Strong 7th house support suggests meaningful relationship developments",
        "Your chart radiates magnetic energy for deep emotional bonds"
      ],
      medium: [
        "Relationships require nurturing - communication is your superpower now",
        "Balance between independence and togetherness is highlighted",
        "Growth through relationships comes with patience and understanding"
      ],
      low: [
        "A time for self-reflection before seeking new connections",
        "Focus on healing and self-love - the right connections will follow",
        "Inner work now sets foundation for future relationship success"
      ]
    },
    wealth: {
      high: [
        "Dhana yogas activate - financial abundance flows toward you",
        "Jupiter's blessings indicate prosperity through wisdom and ethics",
        "Strong wealth indicators suggest smart investments pay off"
      ],
      medium: [
        "Steady financial growth through disciplined efforts is indicated",
        "Multiple income streams may stabilize your financial foundation",
        "Conservative strategies align better with current planetary positions"
      ],
      low: [
        "Focus on financial wisdom over quick gains during this period",
        "Building savings takes priority - avoid speculative ventures",
        "Patience in money matters leads to long-term security"
      ]
    },
    health: {
      high: [
        "Vital energy flows strong - D-30 and maraka analysis confirm excellent vitality",
        "Advanced health analysis shows minimal risk factors - maintain wellness",
        "Your constitution is exceptionally well-supported - 8th house shows stability"
      ],
      medium: [
        "Balanced health indicators - divisional charts suggest regular care",
        "Mind-body practices beneficial - maraka periods require mindful attention",
        "Prevention is key - D-30 analysis guides targeted health strategies"
      ],
      low: [
        "Enhanced health monitoring advised - maraka/8th house factors detected",
        "Advanced analysis suggests extra vigilance - prioritize preventive care",
        "D-30 chart indicates vulnerable periods - rest and recovery essential"
      ]
    },
    education: {
      high: [
        "Mercury and Jupiter bless learning - absorb knowledge like a sponge",
        "Excellent period for certifications, degrees, or skill mastery",
        "Your mind is sharp - complex subjects become accessible"
      ],
      medium: [
        "Steady learning pace recommended - consistency beats intensity",
        "Practical application of knowledge brings the best results",
        "Collaborative learning environments enhance your growth"
      ],
      low: [
        "Review and consolidate existing knowledge before new ventures",
        "Focus on foundational skills rather than advanced topics",
        "Patience in learning leads to deeper understanding"
      ]
    },
    family: {
      high: [
        "Moon's blessings bring harmony to home and family bonds",
        "Strong 4th house indicates domestic happiness and peace",
        "Family support systems are your greatest strength now"
      ],
      medium: [
        "Balance personal needs with family responsibilities gracefully",
        "Communication bridges any gaps in family understanding",
        "Quality time over quantity strengthens family bonds"
      ],
      low: [
        "Navigate family dynamics with patience and compassion",
        "Setting healthy boundaries serves everyone's growth",
        "Focus on inner peace to reflect harmony outward"
      ]
    },
    spirituality: {
      high: [
        "Ketu and Jupiter guide your spiritual awakening beautifully",
        "Deep insights and mystical experiences are highlighted",
        "Your soul's journey accelerates - trust the inner guidance"
      ],
      medium: [
        "Regular spiritual practice deepens your connection to self",
        "Balance material and spiritual pursuits for wholeness",
        "Seek teachers and teachings that resonate with your path"
      ],
      low: [
        "Ground yourself before reaching for higher experiences",
        "Practical spirituality serves better than abstract seeking",
        "Service to others becomes your spiritual practice now"
      ]
    },
    travel: {
      high: [
        "Rahu blesses foreign connections and adventurous journeys",
        "Excellent period for international opportunities and exploration",
        "Travel brings transformation and new perspectives"
      ],
      medium: [
        "Short trips and local exploration satisfy the wanderlust",
        "Plan travel carefully - preparation ensures enjoyment",
        "Virtual connections may substitute for physical travel"
      ],
      low: [
        "Home holds more treasures than distant lands right now",
        "Inner journeys may be more rewarding than outer ones",
        "If travel is necessary, extra planning ensures safety"
      ]
    }
  };

  const level = score >= 0.65 ? 'high' : score >= 0.45 ? 'medium' : 'low';
  const categoryInsights = insights[categoryId] || insights['career'];
  const levelInsights = categoryInsights[level] || categoryInsights['medium'];

  // Pick based on factor balance for variety
  const index = (supportingCount + contradictingCount) % levelInsights.length;
  return levelInsights[index];
}

function getConfidenceColor(score: number): string {
  if (score >= 0.7) return 'text-green-500';
  if (score >= 0.5) return 'text-yellow-500';
  if (score >= 0.35) return 'text-orange-500';
  return 'text-red-500';
}

function getConfidenceLevel(score: number): string {
  if (score >= 0.8) return 'Very Strong';
  if (score >= 0.65) return 'Strong';
  if (score >= 0.5) return 'Moderate';
  if (score >= 0.35) return 'Weak';
  return 'Very Weak';
}

function getProgressColor(score: number): string {
  if (score >= 0.7) return 'bg-green-500';
  if (score >= 0.5) return 'bg-yellow-500';
  if (score >= 0.35) return 'bg-orange-500';
  return 'bg-red-500';
}

function FactorBadge({ factor, isSupporting }: { factor: ConfidenceFactor; isSupporting: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-md text-xs",
      isSupporting ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
    )}>
      {isSupporting ? (
        <CheckCircle2 className="h-3 w-3 text-green-500" />
      ) : (
        <XCircle className="h-3 w-3 text-red-500" />
      )}
      <span className="font-medium">{factor.name}</span>
      <span className="text-muted-foreground">({Math.round(factor.strength * 100)}%)</span>
    </div>
  );
}

function CategoryCard({
  categoryId,
  data,
  birthData
}: {
  categoryId: string;
  data: CategoryConfidence;
  birthData?: BirthData | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = categoryIcons[categoryId] || Info;
  const confidence = data.confidence;
  const interpretation = data.interpretation;
  const score = confidence.overall_confidence;

  // Fetch timing data for this category when expanded
  const {
    data: timingData,
    isLoading: timingLoading,
    error: timingError
  } = useCategoryTiming(birthData || null, categoryId, 5, isOpen && !!birthData);

  // Get AI-powered insight for this category
  const aiInsight = getAIInsight(
    categoryId,
    score,
    confidence.supporting_factors.length,
    confidence.contradicting_factors.length
  );

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  score >= 0.6 ? "bg-green-500/10" : score >= 0.4 ? "bg-yellow-500/10" : "bg-red-500/10"
                )}>
                  <Icon className={cn("h-5 w-5", getConfidenceColor(score))} />
                </div>
                <div className="text-left">
                  <CardTitle className="text-base">
                    {categoryNames[categoryId] || categoryId}
                  </CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    <span className="italic text-purple-300/80">{aiInsight}</span>
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={cn("text-2xl font-bold", getConfidenceColor(score))}>
                    {confidence.confidence_percentage}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {confidence.confidence_band.display}
                  </div>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 pb-3">
            <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all", getProgressColor(score))}
                style={{ width: `${score * 100}%` }}
              />
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="border-t pt-4 space-y-4">
            {/* Summary */}
            <p className="text-sm text-muted-foreground">
              {interpretation.summary}
            </p>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Natal Strength</span>
                  <span>{Math.round(confidence.breakdown.natal_strength * 100)}%</span>
                </div>
                <Progress value={confidence.breakdown.natal_strength * 100} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Dasha Support</span>
                  <span>{Math.round(confidence.breakdown.dasha_support * 100)}%</span>
                </div>
                <Progress value={confidence.breakdown.dasha_support * 100} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Yoga Support</span>
                  <span>{Math.round(confidence.breakdown.yoga_support * 100)}%</span>
                </div>
                <Progress value={confidence.breakdown.yoga_support * 100} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Transit Support</span>
                  <span>{Math.round(confidence.breakdown.transit_support * 100)}%</span>
                </div>
                <Progress value={confidence.breakdown.transit_support * 100} className="h-1" />
              </div>
            </div>

            {/* Supporting Factors */}
            {confidence.supporting_factors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  Supporting Factors ({confidence.supporting_factors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {confidence.supporting_factors.slice(0, 4).map((factor, i) => (
                    <FactorBadge key={i} factor={factor} isSupporting={true} />
                  ))}
                  {confidence.supporting_factors.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{confidence.supporting_factors.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Contradicting Factors */}
            {confidence.contradicting_factors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  Challenges ({confidence.contradicting_factors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {confidence.contradicting_factors.slice(0, 3).map((factor, i) => (
                    <FactorBadge key={i} factor={factor} isSupporting={false} />
                  ))}
                  {confidence.contradicting_factors.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{confidence.contradicting_factors.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Advice */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <p className="text-sm">{interpretation.advice}</p>
              </div>
            </div>

            {/* Enhanced Health Analysis - Only for health category */}
            {categoryId === 'health' && (
              <HealthDetailsCard
                factors={[...confidence.supporting_factors, ...confidence.contradicting_factors]}
              />
            )}

            {/* Timing Section - Only show if birthData is available */}
            {birthData && (
              <TimingSection
                data={timingData}
                isLoading={timingLoading}
                error={timingError}
                categoryName={categoryNames[categoryId] || categoryId}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function ConfidenceOverview({ data, isLoading, error, birthData }: ConfidenceOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Confidence Analysis</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Please enter your birth details to see confidence analysis.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const overallStrength = data.overall_chart_strength;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Life Overview</CardTitle>
              <CardDescription>
                Confidence-scored analysis across all life areas
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={cn("text-4xl font-bold", getConfidenceColor(overallStrength))}>
                {Math.round(overallStrength * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Overall Chart Strength
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all", getProgressColor(overallStrength))}
              style={{ width: `${overallStrength * 100}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.key_strengths.slice(0, 3).map((strength, i) => (
              <Badge key={i} variant="outline" className="bg-green-500/10 border-green-500/30">
                {strength.split(':')[0]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data.categories).map(([categoryId, categoryData]) => (
          <CategoryCard
            key={categoryId}
            categoryId={categoryId}
            data={categoryData}
            birthData={birthData}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">About Confidence Scores</p>
              <p>
                These scores represent the strength and consistency of astrological indications,
                not certainties. They are calculated from natal placements, dasha periods, yogas,
                and transits. Higher scores indicate stronger and more consistent planetary support.
                Free will and personal choices always play a significant role in life outcomes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfidenceOverview;

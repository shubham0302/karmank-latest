/**
 * Timing Section Component
 * Displays favorable and challenging time periods for each life area
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Star,
  Sun,
  AlertTriangle,
  Clock,
  Calendar,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Shield,
  History,
  Compass,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type {
  CategoryTimingResponse,
  TimingPeriod,
  CurrentPeriod
} from '@/astrology/lib/api/astrology-api';

interface TimingSectionProps {
  data: CategoryTimingResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  categoryName: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getPeriodIcon(periodType: string) {
  switch (periodType) {
    case 'golden':
      return <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
    case 'favorable':
      return <Sun className="h-4 w-4 text-green-500" />;
    case 'neutral':
      return <Clock className="h-4 w-4 text-gray-500" />;
    case 'challenging':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'difficult':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getPeriodColor(periodType: string): string {
  switch (periodType) {
    case 'golden':
      return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    case 'favorable':
      return 'bg-green-500/10 border-green-500/30';
    case 'neutral':
      return 'bg-gray-500/10 border-gray-500/30';
    case 'challenging':
      return 'bg-orange-500/10 border-orange-500/30';
    case 'difficult':
      return 'bg-red-500/10 border-red-500/30';
    default:
      return 'bg-gray-500/10 border-gray-500/30';
  }
}

function getPeriodBadgeVariant(periodType: string): "default" | "secondary" | "destructive" | "outline" {
  switch (periodType) {
    case 'golden':
    case 'favorable':
      return 'default';
    case 'challenging':
    case 'difficult':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function CurrentPeriodCard({ period }: { period: CurrentPeriod }) {
  const isPositive = period.period_type === 'golden' || period.period_type === 'favorable';

  return (
    <Card className={cn(
      "border-2",
      getPeriodColor(period.period_type)
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPeriodIcon(period.period_type)}
            <CardTitle className="text-sm">Current Phase</CardTitle>
          </div>
          <Badge variant={getPeriodBadgeVariant(period.period_type)} className="text-xs">
            {period.period_type.charAt(0).toUpperCase() + period.period_type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{period.dasha_info} Period</span>
          <span>{period.days_remaining} days remaining</span>
        </div>

        <Progress
          value={period.progress_percentage}
          className="h-2"
        />

        <p className="text-sm">
          {period.description}
        </p>

        {period.key_factors && period.key_factors.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {period.key_factors.map((factor, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {factor}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PeriodCard({ period, type }: { period: TimingPeriod; type: 'golden' | 'favorable' | 'challenging' }) {
  const icons = {
    golden: <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />,
    favorable: <TrendingUp className="h-3 w-3 text-green-500" />,
    challenging: <Shield className="h-3 w-3 text-orange-500" />
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border text-sm",
      getPeriodColor(period.period_type)
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icons[type]}
          <span className="font-medium text-xs">{period.dasha_info}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDateRange(period.start_date, period.end_date)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {period.description}
      </p>
    </div>
  );
}

export function TimingSection({ data, isLoading, error, categoryName }: TimingSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-4 border-destructive/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-destructive">Error Loading Timing Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const hasGoldenPeriods = data.golden_periods && data.golden_periods.length > 0;
  const hasFavorablePeriods = data.favorable_periods && data.favorable_periods.length > 0;
  const hasChallengingPeriods = data.challenging_periods && data.challenging_periods.length > 0;

  return (
    <Card className="mt-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-base">
                  Timing Predictions for {categoryName}
                </CardTitle>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )} />
            </div>
            <CardDescription className="text-left flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span className="italic text-purple-300/80">{data.timeline_summary}</span>
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <Tabs defaultValue="present" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="past" className="text-xs">
                  <History className="h-3 w-3 mr-1" />
                  Past
                </TabsTrigger>
                <TabsTrigger value="present" className="text-xs">
                  <Compass className="h-3 w-3 mr-1" />
                  Present
                </TabsTrigger>
                <TabsTrigger value="future" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Future
                </TabsTrigger>
              </TabsList>

              {/* Past Tab - For Validation */}
              <TabsContent value="past" className="space-y-3 mt-4">
                <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-md">
                  <History className="h-3 w-3 inline mr-1" />
                  Reflect on past periods to validate predictions
                </div>

                {data.past_periods && data.past_periods.length > 0 ? (
                  <div className="space-y-2">
                    {data.past_periods.slice(0, 5).map((period, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-3 rounded-lg border text-sm",
                          getPeriodColor(period.period_type)
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getPeriodIcon(period.period_type)}
                            <span className="font-medium text-xs">{period.dasha_info}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDateRange(period.start_date, period.end_date)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {period.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No past period data available
                  </p>
                )}
              </TabsContent>

              {/* Present Tab - Current Period */}
              <TabsContent value="present" className="space-y-3 mt-4">
                <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-md">
                  <Compass className="h-3 w-3 inline mr-1" />
                  Your current astrological period
                </div>

                {data.current_period && data.current_period.period_type !== 'neutral' ? (
                  <CurrentPeriodCard period={data.current_period as CurrentPeriod} />
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-6">
                      <p className="text-sm text-muted-foreground text-center">
                        Currently in a neutral period with balanced energies
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Future Tab - Upcoming Periods */}
              <TabsContent value="future" className="space-y-4 mt-4">
                <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-md">
                  <Zap className="h-3 w-3 inline mr-1" />
                  Upcoming opportunities and challenges
                </div>

                {/* Golden Periods */}
                {hasGoldenPeriods && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <h4 className="text-sm font-medium">
                        Golden Periods ({data.golden_periods.length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {data.golden_periods.slice(0, 3).map((period, i) => (
                        <PeriodCard key={i} period={period} type="golden" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorable Periods */}
                {hasFavorablePeriods && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <h4 className="text-sm font-medium">
                        Favorable Periods ({data.favorable_periods.length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {data.favorable_periods.slice(0, 3).map((period, i) => (
                        <PeriodCard key={i} period={period} type="favorable" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenging Periods */}
                {hasChallengingPeriods && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-500" />
                      <h4 className="text-sm font-medium">
                        Periods Requiring Attention ({data.challenging_periods.length})
                      </h4>
                    </div>
                    <div className="grid gap-2">
                      {data.challenging_periods.slice(0, 2).map((period, i) => (
                        <PeriodCard key={i} period={period} type="challenging" />
                      ))}
                    </div>
                  </div>
                )}

                {/* No special periods */}
                {!hasGoldenPeriods && !hasFavorablePeriods && !hasChallengingPeriods && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No significant timing windows identified in the next 5 years.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default TimingSection;

/**
 * Remedies Display Component
 * Shows personalized Vedic astrology remedies based on planetary strengths
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/astrology/hooks/use-toast';
import {
  Gem,
  Music,
  Heart,
  Apple,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  Compass,
  Copy,
  Volume2
} from 'lucide-react';
import type { PlanetRemedies, GeneralRemedies } from '@/astrology/lib/api/astrology-api';

interface RemediesCardProps {
  personalizedRemedies: PlanetRemedies[];
  generalRemedies: GeneralRemedies;
  importantNote: string;
}

// Mantra Card Component with Copy functionality
interface MantraCardProps {
  title: string;
  mantra: string;
  description: string;
  color: 'purple' | 'blue' | 'green' | 'amber';
  isPrimary?: boolean;
}

// Worship Method Card - Highlights specific mantras/practices from worship_method
interface WorshipMethodCardProps {
  worshipMethod: string;
  deity: string;
}

function WorshipMethodCard({ worshipMethod, deity }: WorshipMethodCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(worshipMethod);
      toast({
        title: "Copied!",
        description: "Worship method copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-md overflow-hidden">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-purple-600" />
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              Worship Method & Mantra Jaap
            </p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Primary</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-white/20"
            onClick={copyToClipboard}
            title="Copy worship method"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Worship Method Text - Large and Clear */}
        <div className="bg-white/50 dark:bg-black/20 rounded-md p-3 mb-2">
          <p className="text-sm font-semibold leading-relaxed select-all">
            {worshipMethod}
          </p>
        </div>

        <p className="text-[10px] opacity-80">
          Follow this practice for {deity} worship. Copy and save for daily reference.
        </p>
      </div>
    </div>
  );
}

function MantraCard({ title, mantra, description, color, isPrimary }: MantraCardProps) {
  const { toast } = useToast();

  const colorClasses = {
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mantra);
      toast({
        title: "Copied!",
        description: `${title} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden ${colorClasses[color]}`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <p className="text-xs font-semibold">{title}</p>
            {isPrimary && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Recommended</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-white/20"
            onClick={copyToClipboard}
            title="Copy mantra"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mantra Text - Large and Clear */}
        <div className={`${isPrimary ? 'bg-white/50 dark:bg-black/20' : 'bg-white/30 dark:bg-black/10'} rounded-md p-3 mb-2`}>
          <p className={`${isPrimary ? 'text-lg font-bold' : 'text-sm font-medium'} leading-relaxed select-all`}>
            {mantra}
          </p>
        </div>

        <p className="text-[10px] opacity-80">{description}</p>
      </div>
    </div>
  );
}

export function RemediesCard({ personalizedRemedies, generalRemedies, importantNote }: RemediesCardProps) {
  // Sort remedies by priority (weak planets first)
  const sortedRemedies = [...personalizedRemedies].sort((a, b) => {
    const priorityOrder: { [key: string]: number } = {
      'urgent': 1,
      'high': 2,
      'medium': 3,
      'low': 4
    };
    return (priorityOrder[a.priority.toLowerCase()] || 5) - (priorityOrder[b.priority.toLowerCase()] || 5);
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Important Warning */}
      <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription className="text-sm">
          {importantNote}
        </AlertDescription>
      </Alert>

      {/* Personalized Remedies by Planet */}
      {sortedRemedies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Personalized Remedies</h3>
            <Badge variant="secondary">{sortedRemedies.length} planet{sortedRemedies.length > 1 ? 's' : ''}</Badge>
          </div>

          {sortedRemedies.map((remedy, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getPlanetIcon(remedy.planet)}</div>
                    <div>
                      <CardTitle className="text-base">{remedy.planet}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {remedy.current_strength} strength • {remedy.issue_type}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(remedy.priority) as any} className="gap-1">
                    {getPriorityIcon(remedy.priority)}
                    {remedy.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="gemstone" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="gemstone" className="text-xs">
                      <Gem className="h-3 w-3 mr-1" />
                      Gem
                    </TabsTrigger>
                    <TabsTrigger value="mantras" className="text-xs">
                      <Music className="h-3 w-3 mr-1" />
                      Mantra
                    </TabsTrigger>
                    <TabsTrigger value="charity" className="text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      Charity
                    </TabsTrigger>
                    <TabsTrigger value="fasting" className="text-xs">
                      <Apple className="h-3 w-3 mr-1" />
                      Fast
                    </TabsTrigger>
                    <TabsTrigger value="deity" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Deity
                    </TabsTrigger>
                    <TabsTrigger value="lifestyle" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Daily
                    </TabsTrigger>
                  </TabsList>

                  {/* Gemstone Tab */}
                  <TabsContent value="gemstone" className="space-y-3 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Primary Gemstone</p>
                        <p className="font-medium text-sm">{remedy.gemstone.primary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Weight</p>
                        <p className="font-medium text-sm">{remedy.gemstone.weight}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Metal</p>
                        <p className="font-medium text-sm">{remedy.gemstone.metal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Wear on</p>
                        <p className="font-medium text-sm">{remedy.gemstone.finger}</p>
                      </div>
                    </div>

                    {remedy.gemstone.substitute && remedy.gemstone.substitute.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Substitutes</p>
                        <div className="flex flex-wrap gap-1">
                          {remedy.gemstone.substitute.map((sub, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{sub}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Best Day:</span>
                        <span className="text-xs font-medium">{remedy.gemstone.day_to_wear}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Best Time:</span>
                        <span className="text-xs font-medium">{remedy.gemstone.time}</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs font-medium mb-1">Mantra while wearing:</p>
                      <p className="text-xs text-muted-foreground italic">{remedy.gemstone.mantra_while_wearing}</p>
                    </div>

                    {remedy.gemstone.caution && (
                      <Alert variant="default" className="border-orange-500/50 bg-orange-500/10">
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                        <AlertDescription className="text-xs">{remedy.gemstone.caution}</AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  {/* Mantras Tab */}
                  <TabsContent value="mantras" className="space-y-3 mt-4">
                    {/* Chanting Instructions */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="h-4 w-4 text-purple-600" />
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">Chanting Instructions</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Repetitions:</span>
                          <span className="ml-1 font-semibold">{remedy.mantras.count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Best Time:</span>
                          <span className="ml-1 font-semibold">{remedy.mantras.best_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Beej Mantra - Most Important */}
                      <MantraCard
                        title="Beej Mantra (Seed Mantra)"
                        mantra={remedy.mantras.beej_mantra}
                        description="Most powerful single-syllable mantra. Chant with deep focus."
                        color="purple"
                        isPrimary={true}
                      />

                      {/* Simple Mantra - Easy to Remember */}
                      <MantraCard
                        title="Simple Mantra"
                        mantra={remedy.mantras.simple}
                        description="Easy to remember. Ideal for beginners and daily practice."
                        color="amber"
                      />

                      {/* Vedic Mantra */}
                      <MantraCard
                        title="Vedic Mantra"
                        mantra={remedy.mantras.vedic_mantra}
                        description="Traditional Vedic hymn for deep spiritual connection."
                        color="blue"
                      />

                      {/* Gayatri Mantra */}
                      <MantraCard
                        title="Gayatri Mantra"
                        mantra={remedy.mantras.gayatri}
                        description="Sacred Gayatri for invoking planetary blessings."
                        color="green"
                      />
                    </div>

                    {/* Tips */}
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs font-medium mb-2">Tips for Effective Chanting:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Sit facing East or North in a quiet place</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Use a mala (rosary) with 108 beads for counting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Chant with clear pronunciation and devotion</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Charity Tab */}
                  <TabsContent value="charity" className="space-y-3 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Items to Donate</p>
                      <div className="flex flex-wrap gap-1">
                        {remedy.charity.items_to_donate.map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Help These People</p>
                      <p className="text-sm">{remedy.charity.people_to_help}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Best Day:</span>
                      <span className="text-sm font-medium">{remedy.charity.best_day}</span>
                    </div>

                    {remedy.charity.additional && (
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-xs">{remedy.charity.additional}</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Fasting Tab */}
                  <TabsContent value="fasting" className="space-y-3 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Fasting Day</p>
                        <p className="font-medium">{remedy.fasting.day}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Type</p>
                        <p className="font-medium">{remedy.fasting.type}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Allowed During Fast</p>
                      <p className="text-sm">{remedy.fasting.allowed}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Break Fast With</p>
                      <p className="text-sm">{remedy.fasting.break_fast_with}</p>
                    </div>
                  </TabsContent>

                  {/* Deity Tab */}
                  <TabsContent value="deity" className="space-y-3 mt-4">
                    {/* Primary Deity Header */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Primary Deity</p>
                      <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{remedy.deity_worship.primary_deity}</p>
                      {remedy.deity_worship.secondary && remedy.deity_worship.secondary.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Also Worship</p>
                          <div className="flex flex-wrap gap-1">
                            {remedy.deity_worship.secondary.map((deity, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{deity}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Worship Method - Highlighted with Copy */}
                    <WorshipMethodCard
                      worshipMethod={remedy.deity_worship.worship_method}
                      deity={remedy.deity_worship.primary_deity}
                    />

                    {/* Stotram/Hymn with Copy */}
                    <MantraCard
                      title="Recommended Stotram"
                      mantra={remedy.deity_worship.stotram}
                      description={`Recite this stotram for ${remedy.deity_worship.primary_deity} blessings.`}
                      color="green"
                      isPrimary={true}
                    />

                    <Separator />

                    {/* Offerings */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Offerings (Prasad)</p>
                      <p className="text-sm">{remedy.deity_worship.offerings}</p>
                    </div>

                    {/* Yantra */}
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs font-medium mb-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Yantra
                      </p>
                      <p className="text-xs text-muted-foreground">{remedy.deity_worship.yantra}</p>
                    </div>

                    {/* Worship Tips */}
                    <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
                      <p className="text-xs font-medium mb-2 text-amber-700 dark:text-amber-400">Worship Tips:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-amber-600 flex-shrink-0" />
                          <span>Light a diya (lamp) with ghee or sesame oil</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-amber-600 flex-shrink-0" />
                          <span>Offer fresh flowers and incense</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-amber-600 flex-shrink-0" />
                          <span>Chant mantra with devotion and focus</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Lifestyle Tab */}
                  <TabsContent value="lifestyle" className="space-y-3 mt-4">
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-2">
                        <Compass className="h-4 w-4" />
                        Colors & Directions
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-muted/30 p-2 rounded">
                          <p className="text-xs text-muted-foreground">Color</p>
                          <p className="text-sm font-medium">{remedy.colors_directions.color}</p>
                        </div>
                        <div className="bg-muted/30 p-2 rounded">
                          <p className="text-xs text-muted-foreground">Direction</p>
                          <p className="text-sm font-medium">{remedy.colors_directions.direction}</p>
                        </div>
                        <div className="bg-muted/30 p-2 rounded">
                          <p className="text-xs text-muted-foreground">Day Ruler</p>
                          <p className="text-sm font-medium">{remedy.colors_directions.day_ruler}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {remedy.quick_remedies && remedy.quick_remedies.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Quick Daily Remedies</p>
                        <ul className="space-y-1">
                          {remedy.quick_remedies.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {remedy.lifestyle_changes && remedy.lifestyle_changes.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Lifestyle Changes</p>
                        <ul className="space-y-1">
                          {remedy.lifestyle_changes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* General Remedies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            General Remedies for Everyone
          </CardTitle>
          <CardDescription>
            Universal practices beneficial for spiritual growth and well-being
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalRemedies.daily_practices && generalRemedies.daily_practices.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Daily Practices</p>
              <ul className="space-y-1">
                {generalRemedies.daily_practices.map((practice, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generalRemedies.weekly_practices && generalRemedies.weekly_practices.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Weekly Practices</p>
              <ul className="space-y-1">
                {generalRemedies.weekly_practices.map((practice, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generalRemedies.monthly_practices && generalRemedies.monthly_practices.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Monthly Practices</p>
              <ul className="space-y-1">
                {generalRemedies.monthly_practices.map((practice, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generalRemedies.important_tips && generalRemedies.important_tips.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-md">
              <p className="text-sm font-medium mb-2 text-amber-700 dark:text-amber-400">Important Tips</p>
              <ul className="space-y-1">
                {generalRemedies.important_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get planet emoji/icon
function getPlanetIcon(planet: string): string {
  const icons: { [key: string]: string } = {
    'Sun': '☀️',
    'Moon': '🌙',
    'Mars': '♂️',
    'Mercury': '☿️',
    'Jupiter': '♃',
    'Venus': '♀️',
    'Saturn': '♄',
    'Rahu': '☊',
    'Ketu': '☋',
  };
  return icons[planet] || '⭐';
}

export default RemediesCard;

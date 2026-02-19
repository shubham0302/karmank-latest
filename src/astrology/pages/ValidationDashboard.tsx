/**
 * Validation Dashboard Page
 * Displays prediction accuracy metrics, calibration curves, and factor reliability
 */

import { useState } from 'react';
import Navbar from '@/astrology/components/layout/Navbar';
import CosmicBackground from '@/components/CosmicBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Target,
  RefreshCw,
  Database,
  BarChart3,
  TrendingUp,
  Trash2,
  Plus
} from 'lucide-react';
import CalibrationVisualization from '@/astrology/components/confidence/CalibrationVisualization';
import { useValidationData, useInitializeSampleData } from '@/astrology/hooks/useValidationAPI';
import { toast } from 'sonner';

export default function ValidationDashboard() {
  const {
    calibrationData,
    factorReliability,
    categoryAccuracy,
    validationSummary,
    isLoading,
    error,
    refetch
  } = useValidationData();

  const initializeSample = useInitializeSampleData();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeSampleData = async () => {
    setIsInitializing(true);
    try {
      await initializeSample.mutateAsync();
      toast.success('Sample data initialized successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to initialize sample data');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Validation data refreshed');
  };

  return (
    <CosmicBackground density={140} useVideo={true}>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
              <Target className="h-8 w-8 text-violet-400" />
              Validation Dashboard
            </h1>
            <p className="text-white/60 mt-2">
              Track prediction accuracy and calibration quality
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isInitializing}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sample Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Initialize Sample Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will add 5 sample validation records for testing purposes.
                    This is useful for seeing how the calibration visualization works.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleInitializeSampleData}>
                    Initialize
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Status Badge */}
        {validationSummary && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-sm py-1 px-3">
                <Database className="h-3 w-3 mr-1" />
                {validationSummary.total_validations} Validations
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                <BarChart3 className="h-3 w-3 mr-1" />
                {(validationSummary.average_accuracy * 100).toFixed(1)}% Avg Accuracy
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                <TrendingUp className="h-3 w-3 mr-1" />
                {validationSummary.calibration_quality}
              </Badge>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calibration">Calibration</TabsTrigger>
            <TabsTrigger value="factors">Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CalibrationVisualization
              calibrationData={calibrationData}
              factorReliability={factorReliability}
              categoryAccuracy={categoryAccuracy}
              validationSummary={validationSummary}
              isLoading={isLoading}
              error={error as Error | null}
            />
          </TabsContent>

          <TabsContent value="calibration" className="space-y-6">
            {calibrationData && !calibrationData.error ? (
              <Card>
                <CardHeader>
                  <CardTitle>Calibration Details</CardTitle>
                  <CardDescription>
                    Detailed breakdown of calibration metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-500">Brier Score</div>
                      <div className="text-2xl font-bold">{calibrationData.brier_score.toFixed(4)}</div>
                      <div className="text-xs text-slate-400">Lower is better</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-500">Mean Absolute Error</div>
                      <div className="text-2xl font-bold">{(calibrationData.mean_absolute_error * 100).toFixed(1)}%</div>
                      <div className="text-xs text-slate-400">Avg prediction error</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-500">Max Calibration Error</div>
                      <div className="text-2xl font-bold">{(calibrationData.max_calibration_error * 100).toFixed(1)}%</div>
                      <div className="text-xs text-slate-400">Worst bucket error</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-500">Total Samples</div>
                      <div className="text-2xl font-bold">{calibrationData.total_samples}</div>
                      <div className="text-xs text-slate-400">Validated predictions</div>
                    </div>
                  </div>

                  {calibrationData.calibration_buckets && calibrationData.calibration_buckets.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Calibration Buckets</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Predicted</th>
                              <th className="text-left py-2">Actual Rate</th>
                              <th className="text-left py-2">Samples</th>
                              <th className="text-left py-2">Error</th>
                              <th className="text-left py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calibrationData.calibration_buckets.map((bucket, idx) => (
                              <tr key={idx} className="border-b border-slate-100">
                                <td className="py-2">{(bucket.predicted_confidence * 100).toFixed(0)}%</td>
                                <td className="py-2">{(bucket.actual_rate * 100).toFixed(1)}%</td>
                                <td className="py-2">{bucket.sample_size}</td>
                                <td className="py-2">{(bucket.calibration_error * 100).toFixed(1)}%</td>
                                <td className="py-2">
                                  <Badge variant={bucket.is_well_calibrated ? 'default' : 'destructive'}>
                                    {bucket.is_well_calibrated ? 'Good' : 'Needs Work'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-blue-700">
                    Not enough data for calibration analysis. At least 10 validated predictions are needed.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            {factorReliability && Object.keys(factorReliability).length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Factor Reliability Scores</CardTitle>
                  <CardDescription>
                    Historical accuracy of individual astrological factors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(factorReliability)
                      .sort(([, a], [, b]) => b - a)
                      .map(([factor, reliability]) => (
                        <div key={factor} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="font-medium">{factor.replace(/_/g, ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-violet-600 rounded-full"
                                style={{ width: `${reliability * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-12 text-right">
                              {(reliability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-blue-700">
                    Factor reliability data will appear after more predictions are validated.
                    Each factor needs at least 5 samples for reliable scoring.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Validation Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-violet-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Record Outcomes</h4>
                <p className="text-sm text-slate-600">
                  When a predicted event happens (or doesn't), record the actual outcome
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-violet-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Analyze Accuracy</h4>
                <p className="text-sm text-slate-600">
                  The system calculates calibration curves and factor reliability scores
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-violet-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Improve Predictions</h4>
                <p className="text-sm text-slate-600">
                  Future predictions are adjusted based on historical factor accuracy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CosmicBackground>
  );
}

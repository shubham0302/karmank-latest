/**
 * Calibration Visualization Component
 * Displays validation metrics and calibration curves for the prediction system
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for validation data
interface CalibrationBucket {
  predicted_confidence: number;
  actual_rate: number;
  sample_size: number;
  calibration_error: number;
  is_well_calibrated: boolean;
}

interface CalibrationData {
  brier_score: number;
  mean_absolute_error: number;
  max_calibration_error: number;
  mean_calibration_error: number;
  total_samples: number;
  buckets: CalibrationBucket[];
  calibration_buckets: Array<{
    predicted_confidence: number;
    actual_rate: number;
    sample_size: number;
    calibration_error: number;
    is_well_calibrated: boolean;
  }>;
  is_well_calibrated: boolean;
  interpretation: string;
}

interface FactorReliability {
  [factor: string]: number;
}

interface CategoryAccuracy {
  [category: string]: {
    sample_size: number;
    average_accuracy: number;
    average_confidence_error: number;
    average_timing_error_days: number;
    best_prediction: number;
    worst_prediction: number;
  };
}

interface ValidationSummary {
  total_validations: number;
  average_accuracy: number;
  median_accuracy: number;
  calibration_quality: string;
  top_factors: Array<{ name: string; reliability: number }>;
}

interface CalibrationVisualizationProps {
  calibrationData: CalibrationData | null;
  factorReliability: FactorReliability | null;
  categoryAccuracy: CategoryAccuracy | null;
  validationSummary: ValidationSummary | null;
  isLoading: boolean;
  error: Error | null;
}

// Helper function to format percentage
const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

// Color scale for calibration quality
const getCalibrationColor = (error: number): string => {
  if (error < 0.05) return '#22c55e'; // green - excellent
  if (error < 0.10) return '#84cc16'; // lime - good
  if (error < 0.15) return '#eab308'; // yellow - acceptable
  if (error < 0.20) return '#f97316'; // orange - needs improvement
  return '#ef4444'; // red - poor
};

// Get quality label
const getQualityLabel = (brierScore: number): { label: string; color: string } => {
  if (brierScore < 0.10) return { label: 'Excellent', color: 'bg-green-500' };
  if (brierScore < 0.15) return { label: 'Good', color: 'bg-lime-500' };
  if (brierScore < 0.20) return { label: 'Acceptable', color: 'bg-yellow-500' };
  if (brierScore < 0.25) return { label: 'Needs Improvement', color: 'bg-orange-500' };
  return { label: 'Poor', color: 'bg-red-500' };
};

export default function CalibrationVisualization({
  calibrationData,
  factorReliability,
  categoryAccuracy,
  validationSummary,
  isLoading,
  error
}: CalibrationVisualizationProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Validation Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!calibrationData) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Info className="h-5 w-5" />
            No Validation Data Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-600">
            Start recording prediction outcomes to build calibration data.
            At least 10 validated predictions are needed for calibration curves.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare calibration curve data
  const calibrationCurveData = calibrationData.calibration_buckets.map(bucket => ({
    predicted: bucket.predicted_confidence * 100,
    actual: bucket.actual_rate * 100,
    samples: bucket.sample_size,
    error: bucket.calibration_error * 100,
    wellCalibrated: bucket.is_well_calibrated
  }));

  // Add perfect calibration line data
  const perfectLine = [
    { predicted: 0, perfect: 0 },
    { predicted: 100, perfect: 100 }
  ];

  // Prepare factor reliability data
  const factorData = factorReliability
    ? Object.entries(factorReliability)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, reliability]) => ({
          name: name.replace(/_/g, ' '),
          reliability: reliability * 100,
          color: getCalibrationColor(1 - reliability)
        }))
    : [];

  // Prepare category accuracy data
  const categoryData = categoryAccuracy
    ? Object.entries(categoryAccuracy).map(([category, metrics]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        accuracy: metrics.average_accuracy * 100,
        samples: metrics.sample_size,
        best: metrics.best_prediction * 100,
        worst: metrics.worst_prediction * 100
      }))
    : [];

  const quality = getQualityLabel(calibrationData.brier_score);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Brier Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Brier Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calibrationData.brier_score.toFixed(4)}</div>
            <Badge className={cn('mt-2', quality.color)}>{quality.label}</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Lower is better. &lt;0.15 is good.
            </p>
          </CardContent>
        </Card>

        {/* Mean Absolute Error */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mean Absolute Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(calibrationData.mean_absolute_error)}</div>
            <Progress
              value={(1 - calibrationData.mean_absolute_error) * 100}
              className="mt-2 h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Average prediction error
            </p>
          </CardContent>
        </Card>

        {/* Total Samples */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Validations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calibrationData.total_samples}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Predictions with recorded outcomes
            </p>
          </CardContent>
        </Card>

        {/* Calibration Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Calibration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {calibrationData.is_well_calibrated ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="text-lg font-semibold text-green-600">Well Calibrated</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <span className="text-lg font-semibold text-yellow-600">Needs Tuning</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {calibrationData.interpretation}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calibration Curve Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Calibration Curve
          </CardTitle>
          <CardDescription>
            How well do predicted confidence levels match actual outcomes?
            Points on the diagonal line indicate perfect calibration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={calibrationCurveData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="predicted"
                label={{ value: 'Predicted Confidence (%)', position: 'bottom', offset: 0 }}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                label={{ value: 'Actual Success Rate (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === 'actual' ? 'Actual Rate' : name === 'error' ? 'Calibration Error' : name
                ]}
                labelFormatter={(label) => `Predicted: ${label}%`}
              />
              <Legend />
              {/* Perfect calibration reference line */}
              <ReferenceLine
                segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]}
                stroke="#94a3b8"
                strokeDasharray="5 5"
                label="Perfect Calibration"
              />
              {/* Actual calibration curve */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                name="Actual Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Factor Reliability & Category Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factor Reliability */}
        {factorData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Factor Reliability
              </CardTitle>
              <CardDescription>
                Historical accuracy of individual astrological factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={factorData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Reliability']}
                  />
                  <Bar dataKey="reliability" radius={[0, 4, 4, 0]}>
                    {factorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Category Accuracy */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Accuracy by Life Area
              </CardTitle>
              <CardDescription>
                Prediction accuracy across different life categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`,
                      name === 'accuracy' ? 'Avg Accuracy' : name === 'best' ? 'Best' : 'Worst'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#8b5cf6" name="Avg Accuracy" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="best" fill="#22c55e" name="Best" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="worst" fill="#ef4444" name="Worst" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interpretation */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardHeader>
          <CardTitle className="text-violet-800">System Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-violet-700">{calibrationData.interpretation}</p>
          {validationSummary && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-violet-500">Total Validations:</span>
                <span className="font-semibold ml-2">{validationSummary.total_validations}</span>
              </div>
              <div>
                <span className="text-violet-500">Avg Accuracy:</span>
                <span className="font-semibold ml-2">{formatPercent(validationSummary.average_accuracy)}</span>
              </div>
              <div>
                <span className="text-violet-500">Median Accuracy:</span>
                <span className="font-semibold ml-2">{formatPercent(validationSummary.median_accuracy)}</span>
              </div>
              <div>
                <span className="text-violet-500">Quality:</span>
                <span className="font-semibold ml-2">{validationSummary.calibration_quality}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

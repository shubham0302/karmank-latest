/**
 * React Query hooks for Validation API
 * Fetches calibration curves, factor reliability, and validation metrics
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_ASTROLOGY_API_URL || 'http://localhost:8000';

// Types
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
  calibration_buckets: CalibrationBucket[];
  is_well_calibrated: boolean;
  interpretation: string;
  error?: string;
}

interface FactorReliability {
  [factor: string]: number;
}

interface CategoryMetrics {
  sample_size: number;
  average_accuracy: number;
  average_confidence_error: number;
  average_timing_error_days: number;
  best_prediction: number;
  worst_prediction: number;
}

interface CategoryAccuracy {
  [category: string]: CategoryMetrics;
}

interface ValidationSummary {
  total_validations: number;
  average_accuracy: number;
  median_accuracy: number;
  std_dev_accuracy: number;
  success_rate: number;
  average_confidence_error: number;
  calibration_quality: string;
  top_factors: Array<{ name: string; reliability: number }>;
  category_breakdown: CategoryAccuracy;
}

interface ValidationRequest {
  prediction_id: string;
  actual_outcome: boolean;
  actual_timing?: string;
  notes?: string;
}

// API response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// API functions
async function fetchCalibrationCurve(): Promise<CalibrationData> {
  const response = await fetch(`${API_BASE_URL}/api/validation/calibration-curve`);
  if (!response.ok) {
    throw new Error('Failed to fetch calibration curve');
  }
  const result: ApiResponse<CalibrationData> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch calibration curve');
  }
  return result.data;
}

async function fetchFactorReliability(): Promise<FactorReliability> {
  const response = await fetch(`${API_BASE_URL}/api/validation/factor-reliability`);
  if (!response.ok) {
    throw new Error('Failed to fetch factor reliability');
  }
  const result: ApiResponse<FactorReliability> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch factor reliability');
  }
  return result.data;
}

async function fetchCategoryAccuracy(): Promise<CategoryAccuracy> {
  const response = await fetch(`${API_BASE_URL}/api/validation/accuracy-by-category`);
  if (!response.ok) {
    throw new Error('Failed to fetch category accuracy');
  }
  const result: ApiResponse<CategoryAccuracy> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch category accuracy');
  }
  return result.data;
}

async function fetchValidationSummary(): Promise<ValidationSummary> {
  const response = await fetch(`${API_BASE_URL}/api/validation/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch validation summary');
  }
  const result: ApiResponse<ValidationSummary> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch validation summary');
  }
  return result.data;
}

async function recordOutcome(data: ValidationRequest): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/validation/record-outcome`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to record outcome');
  }
  const result = await response.json();
  return result.data || result;
}

async function initializeSampleData(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/validation/initialize-sample-data`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to initialize sample data');
  }
  const result = await response.json();
  return result.data || result;
}

// React Query Hooks
export function useCalibrationCurve() {
  return useQuery({
    queryKey: ['validation', 'calibration'],
    queryFn: fetchCalibrationCurve,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}

export function useFactorReliability() {
  return useQuery({
    queryKey: ['validation', 'factor-reliability'],
    queryFn: fetchFactorReliability,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

export function useCategoryAccuracy() {
  return useQuery({
    queryKey: ['validation', 'category-accuracy'],
    queryFn: fetchCategoryAccuracy,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

export function useValidationSummary() {
  return useQuery({
    queryKey: ['validation', 'summary'],
    queryFn: fetchValidationSummary,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });
}

export function useRecordOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordOutcome,
    onSuccess: () => {
      // Invalidate all validation queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['validation'] });
    }
  });
}

export function useInitializeSampleData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeSampleData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validation'] });
    }
  });
}

// Combined hook for all validation data
export function useValidationData() {
  const calibration = useCalibrationCurve();
  const factorReliability = useFactorReliability();
  const categoryAccuracy = useCategoryAccuracy();
  const summary = useValidationSummary();

  return {
    calibrationData: calibration.data ?? null,
    factorReliability: factorReliability.data ?? null,
    categoryAccuracy: categoryAccuracy.data ?? null,
    validationSummary: summary.data ?? null,
    isLoading: calibration.isLoading || factorReliability.isLoading ||
               categoryAccuracy.isLoading || summary.isLoading,
    error: calibration.error || factorReliability.error ||
           categoryAccuracy.error || summary.error,
    refetch: () => {
      calibration.refetch();
      factorReliability.refetch();
      categoryAccuracy.refetch();
      summary.refetch();
    }
  };
}

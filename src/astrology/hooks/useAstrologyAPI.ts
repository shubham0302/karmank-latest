/**
 * React Hooks for Astrology API
 * Uses React Query for caching and state management
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  BirthData,
  calculateBirthChart,
  detectYogas,
  calculateShadbala,
  getDashaTimeline,
  getCurrentDasha,
  getCurrentActiveYogas,
  getUpcomingYogaActivations,
  getYearlyLifePredictions,
  getLifeAreaAnalysis,
  getMajorLifeEvents,
  getDivisionalCharts,
  getNavamsaChart,
  getCurrentTransits,
  getTransitsOnDate,
  getPersonalizedRemedies,
  getPlanetRemedies,
  getGeneralRemedies,
  getAllGemstones,
  getAllMantras,
  getConfidenceCategories,
  getQuickConfidenceScore,
  getConfidenceAnalysis,
  getLifeOverview,
  getCategoryTiming,
  getTimingOverview,
} from '@/astrology/lib/api/astrology-api';

// ============================================================================
// BIRTH CHART HOOKS
// ============================================================================

export function useBirthChart(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['birthChart', birthData],
    queryFn: () => calculateBirthChart(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// ============================================================================
// YOGA DETECTION HOOKS
// ============================================================================

export function useYogaDetection(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['yogas', birthData],
    queryFn: () => detectYogas(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

export function useCurrentActiveYogas(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['currentYogas', birthData],
    queryFn: () => getCurrentActiveYogas(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes (more frequent updates)
  });
}

export function useUpcomingYogas(
  birthData: BirthData | null,
  yearsAhead: number = 10,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['upcomingYogas', birthData, yearsAhead],
    queryFn: () => getUpcomingYogaActivations(birthData!, yearsAhead),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ============================================================================
// SHADBALA HOOKS
// ============================================================================

export function useShadbala(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['shadbala', birthData],
    queryFn: () => calculateShadbala(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

// ============================================================================
// DASHA HOOKS
// ============================================================================

export function useDashaTimeline(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['dashaTimeline', birthData],
    queryFn: () => getDashaTimeline(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

export function useCurrentDasha(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['currentDasha', birthData],
    queryFn: () => getCurrentDasha(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================================================
// MUTATION HOOKS (for one-time calculations)
// ============================================================================

export function useCalculateBirthChartMutation() {
  return useMutation({
    mutationFn: calculateBirthChart,
  });
}

export function useDetectYogasMutation() {
  return useMutation({
    mutationFn: detectYogas,
  });
}

export function useCalculateShadbalaMutation() {
  return useMutation({
    mutationFn: calculateShadbala,
  });
}

// ============================================================================
// LIFE PREDICTIONS HOOKS
// ============================================================================

export function useMajorLifeEvents(
  birthData: BirthData | null,
  startYear?: number,
  endYear?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['majorLifeEvents', birthData, startYear, endYear],
    queryFn: () => getMajorLifeEvents(birthData!, startYear, endYear),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useLifePredictions(
  birthData: BirthData | null,
  startYear?: number,
  endYear?: number,
  lifeArea?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['lifePredictions', birthData, startYear, endYear, lifeArea],
    queryFn: () => getYearlyLifePredictions(birthData!, startYear, endYear, lifeArea),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useLifeAreaAnalysis(
  birthData: BirthData | null,
  lifeArea: string,
  startYear?: number,
  endYear?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['lifeAreaAnalysis', birthData, lifeArea, startYear, endYear],
    queryFn: () => getLifeAreaAnalysis(birthData!, lifeArea, startYear, endYear),
    enabled: enabled && birthData !== null && !!lifeArea,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// ============================================================================
// DIVISIONAL CHARTS HOOKS
// ============================================================================

export function useDivisionalCharts(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['divisionalCharts', birthData],
    queryFn: () => getDivisionalCharts(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour - divisional charts don't change
    retry: 1,
  });
}

export function useNavamsaChart(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['navamsaChart', birthData],
    queryFn: () => getNavamsaChart(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// ============================================================================
// TRANSITS HOOKS
// ============================================================================

export function useCurrentTransits(birthData: BirthData | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['currentTransits', birthData],
    queryFn: () => getCurrentTransits(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour - transits change daily
    refetchInterval: 1000 * 60 * 60, // Auto-refetch every hour
  });
}

export function useTransitsOnDate(
  birthData: BirthData | null,
  transitDate?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['transitsOnDate', birthData, transitDate],
    queryFn: () => getTransitsOnDate(birthData!, transitDate),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - historical transits don't change
  });
}

// ============================================================================
// REMEDIES HOOKS
// ============================================================================

export function usePersonalizedRemedies(birthData: BirthData | null, enabled: boolean = true) {  return useQuery({
    queryKey: ['personalizedRemedies', birthData],
    queryFn: () => getPersonalizedRemedies(birthData!),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 60, // 1 hour - remedies don't change frequently
  });
}

export function usePlanetRemedies(planetName: string, strength: string = 'Average', enabled: boolean = true) {
  return useQuery({
    queryKey: ['planetRemedies', planetName, strength],
    queryFn: () => getPlanetRemedies(planetName, strength),
    enabled: enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - planet remedies are static
  });
}

export function useGeneralRemedies(enabled: boolean = true) {
  return useQuery({
    queryKey: ['generalRemedies'],
    queryFn: () => getGeneralRemedies(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - general remedies are static
  });
}

export function useAllGemstones(enabled: boolean = true) {
  return useQuery({
    queryKey: ['allGemstones'],
    queryFn: () => getAllGemstones(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - gemstone info is static
  });
}

export function useAllMantras(enabled: boolean = true) {
  return useQuery({
    queryKey: ['allMantras'],
    queryFn: () => getAllMantras(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - mantra info is static
  });
}

// ============================================================================
// CONFIDENCE SCORING HOOKS
// ============================================================================

export function useConfidenceCategories(enabled: boolean = true) {
  return useQuery({
    queryKey: ['confidenceCategories'],
    queryFn: () => getConfidenceCategories(),
    enabled: enabled,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - categories are static
  });
}

export function useQuickConfidenceScore(
  birthData: BirthData | null,
  category: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['quickConfidenceScore', birthData, category],
    queryFn: () => getQuickConfidenceScore(birthData!, category),
    enabled: enabled && birthData !== null && category !== '',
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useConfidenceAnalysis(
  birthData: BirthData | null,
  category: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['confidenceAnalysis', birthData, category],
    queryFn: () => getConfidenceAnalysis(birthData!, category),
    enabled: enabled && birthData !== null && category !== '',
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useLifeOverview(
  birthData: BirthData | null,
  categories?: string[],
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['lifeOverview', birthData, categories],
    queryFn: () => getLifeOverview(birthData!, categories),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ============================================================================
// TIMING PREDICTION HOOKS
// ============================================================================

export function useCategoryTiming(
  birthData: BirthData | null,
  category: string,
  yearsAhead: number = 5,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['categoryTiming', birthData, category, yearsAhead],
    queryFn: () => getCategoryTiming(birthData!, category, yearsAhead),
    enabled: enabled && birthData !== null && category !== '',
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useTimingOverview(
  birthData: BirthData | null,
  yearsAhead: number = 3,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['timingOverview', birthData, yearsAhead],
    queryFn: () => getTimingOverview(birthData!, yearsAhead),
    enabled: enabled && birthData !== null,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

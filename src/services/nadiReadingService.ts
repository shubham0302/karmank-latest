/**
 * Nadi Reading Persistence Service
 * Handles saving and retrieving Nadi readings from Supabase
 */

import { supabase } from '../lib/supabase';
import type { AnalysisOutput, UserInfo } from '../types/palmistry';
import type { ThumbprintMetadata } from './thumbprintPreprocessor';

export interface NadiReading {
  id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: 'classification' | 'verification' | 'analyzing' | 'result';
  bundleNumber: number;
  leafNumber?: number;
  confidenceScore: number;
  totalQuestions: number;
  questionsAnswered: number;
  analysisResult?: AnalysisOutput;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * Save thumbprint classification to database
 */
export const saveThumbprintClassification = async (
  thumbMetadata: ThumbprintMetadata,
  bundleNumber: number,
  biometricHash: string
) => {
  try {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('nadi_thumbprint_classifications')
      .insert({
        user_id: user.user.id,
        biometric_hash: biometricHash,
        quality_score: thumbMetadata.quality.score,
        sharpness_score: thumbMetadata.quality.sharpness,
        contrast_score: thumbMetadata.quality.contrast,
        brightness_score: thumbMetadata.quality.brightness,
        is_acceptable: thumbMetadata.quality.isAcceptable,
        estimated_pattern: thumbMetadata.estimatedPattern,
        pattern_complexity: thumbMetadata.features.complexity,
        has_circles: thumbMetadata.features.hasCircles,
        has_lines: thumbMetadata.features.hasLines,
        bundle_number: bundleNumber,
        total_leaves: 600
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save thumbprint classification:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveThumbprintClassification:', error);
    return null;
  }
};

/**
 * Create a new Nadi reading session
 */
export const createReadingSession = async (
  classificationId: string | null,
  userInfo: UserInfo,
  bundleNumber: number,
  language: string = 'en'
) => {
  try {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const sessionToken = `nadi_${user.user.id}_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    const { data, error } = await supabase
      .from('nadi_user_readings')
      .insert({
        user_id: user.user.id,
        classification_id: classificationId,
        gender: userInfo.gender,
        age_range: userInfo.ageRange,
        language,
        status: 'in_progress',
        current_step: 'classification',
        bundle_number: bundleNumber,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        confidence_score: 45
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create reading session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createReadingSession:', error);
    return null;
  }
};

/**
 * Update reading session progress
 */
export const updateReadingProgress = async (
  readingId: string,
  updates: {
    currentStep?: 'classification' | 'verification' | 'analyzing' | 'result';
    status?: 'in_progress' | 'completed' | 'abandoned';
    questionsAnswered?: number;
    confidenceScore?: number;
    leafNumber?: number;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('nadi_user_readings')
      .update(updates)
      .eq('id', readingId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update reading progress:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateReadingProgress:', error);
    return null;
  }
};

/**
 * Save verification question and answer
 */
export const saveVerificationQuestion = async (
  readingId: string,
  questionIndex: number,
  questionText: { en: string; hi: string },
  questionType: string,
  userAnswer: string,
  confidenceBefore: number,
  confidenceAfter: number
) => {
  try {
    const { data, error } = await supabase
      .from('nadi_verification_questions')
      .insert({
        reading_id: readingId,
        question_index: questionIndex,
        question_text: questionText,
        question_type: questionType,
        user_answer: userAnswer,
        answered_at: new Date().toISOString(),
        confidence_before: confidenceBefore,
        confidence_after: confidenceAfter
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save verification question:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveVerificationQuestion:', error);
    return null;
  }
};

/**
 * Complete reading with final analysis result
 */
export const completeReading = async (
  readingId: string,
  analysisResult: AnalysisOutput,
  bundleInfo: { bundleNumber: number; leafNumber: number }
) => {
  try {
    const { data, error } = await supabase
      .from('nadi_user_readings')
      .update({
        status: 'completed',
        current_step: 'result',
        analysis_result: analysisResult,
        leaf_number: bundleInfo.leafNumber,
        completed_at: new Date().toISOString(),
        matched_at: new Date().toISOString()
      })
      .eq('id', readingId)
      .select()
      .single();

    if (error) {
      console.error('Failed to complete reading:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in completeReading:', error);
    return null;
  }
};

/**
 * Get user's reading history
 */
export const getUserReadings = async (limit: number = 10): Promise<NadiReading[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('nadi_user_readings')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to get user readings:', error);
      return [];
    }

    return (data || []).map(reading => ({
      id: reading.id,
      status: reading.status,
      currentStep: reading.current_step,
      bundleNumber: reading.bundle_number,
      leafNumber: reading.leaf_number,
      confidenceScore: reading.confidence_score,
      totalQuestions: reading.total_questions,
      questionsAnswered: reading.questions_answered,
      analysisResult: reading.analysis_result,
      createdAt: reading.created_at,
      updatedAt: reading.updated_at,
      completedAt: reading.completed_at
    }));
  } catch (error) {
    console.error('Error in getUserReadings:', error);
    return [];
  }
};

/**
 * Resume incomplete reading session
 */
export const resumeReadingSession = async (sessionToken: string) => {
  try {
    const { data, error } = await supabase
      .from('nadi_user_readings')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('status', 'in_progress')
      .single();

    if (error || !data) {
      console.error('Failed to resume reading session:', error);
      return null;
    }

    // Check if session expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase
        .from('nadi_user_readings')
        .update({ status: 'abandoned' })
        .eq('id', data.id);

      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in resumeReadingSession:', error);
    return null;
  }
};

/**
 * Save analytics data
 */
export const saveReadingAnalytics = async (
  readingId: string,
  metrics: {
    averageQualityScore?: number;
    preprocessingTimeMs?: number;
    questionsToMatch?: number;
    verificationDurationSeconds?: number;
    aiAnalysisTimeMs?: number;
    aiModelUsed?: string;
    totalDurationSeconds?: number;
    deviceInfo?: any;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('nadi_reading_analytics')
      .insert({
        reading_id: readingId,
        ...metrics
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save analytics:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveReadingAnalytics:', error);
    return null;
  }
};

/**
 * Generate biometric hash (SHA-256)
 */
export const generateBiometricHash = async (base64Image: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(base64Image);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

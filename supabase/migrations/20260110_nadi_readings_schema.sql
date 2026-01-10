-- Nadi Shastra Reading Persistence Schema
-- Based on Blueprint-Builder's nadi_shastra_schema.sql with enhancements
-- Created: 2026-01-10

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: nadi_thumbprint_classifications
-- Stores thumbprint image quality and pattern metadata
-- ============================================================================
CREATE TABLE IF NOT EXISTS nadi_thumbprint_classifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Biometric data (GDPR compliant - only hash stored)
    biometric_hash TEXT NOT NULL,

    -- Quality assessment results
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    sharpness_score INTEGER CHECK (sharpness_score >= 0 AND sharpness_score <= 100),
    contrast_score INTEGER CHECK (contrast_score >= 0 AND contrast_score <= 100),
    brightness_score INTEGER CHECK (brightness_score >= 0 AND brightness_score <= 100),
    is_acceptable BOOLEAN DEFAULT true,

    -- Pattern classification
    estimated_pattern TEXT, -- 'arch', 'loop', 'whorl', 'unclear'
    pattern_complexity TEXT CHECK (pattern_complexity IN ('simple', 'moderate', 'complex')),
    has_circles BOOLEAN DEFAULT false,
    has_lines BOOLEAN DEFAULT false,

    -- Bundle mapping
    bundle_number INTEGER,
    total_leaves INTEGER DEFAULT 600,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Table: nadi_user_readings
-- Stores complete Nadi reading sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS nadi_user_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    classification_id UUID REFERENCES nadi_thumbprint_classifications(id) ON DELETE SET NULL,

    -- User info at time of reading
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    age_range TEXT,
    language TEXT DEFAULT 'en',

    -- Reading progress
    status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
    current_step TEXT CHECK (current_step IN ('classification', 'verification', 'analyzing', 'result')),

    -- Verification data
    total_questions INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    confidence_score INTEGER DEFAULT 45,
    verification_answers JSONB DEFAULT '[]'::jsonb,

    -- Bundle/leaf matching
    bundle_number INTEGER,
    leaf_number INTEGER,
    matched_at TIMESTAMP WITH TIME ZONE,

    -- AI Analysis results (complete Nadi reading output)
    analysis_result JSONB,

    -- Session management
    session_token TEXT UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- Table: nadi_verification_questions
-- Stores verification questions and answers per reading session
-- ============================================================================
CREATE TABLE IF NOT EXISTS nadi_verification_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reading_id UUID REFERENCES nadi_user_readings(id) ON DELETE CASCADE,

    -- Question details
    question_index INTEGER NOT NULL,
    question_text JSONB NOT NULL, -- { "en": "...", "hi": "..." }
    question_type TEXT, -- 'father_name', 'siblings', 'profession', etc.

    -- Answer details
    user_answer TEXT,
    answered_at TIMESTAMP WITH TIME ZONE,

    -- Confidence tracking
    confidence_before INTEGER,
    confidence_after INTEGER,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Table: nadi_reading_analytics
-- Analytics and metrics for improving the system
-- ============================================================================
CREATE TABLE IF NOT EXISTS nadi_reading_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reading_id UUID REFERENCES nadi_user_readings(id) ON DELETE CASCADE,

    -- Quality metrics
    average_quality_score NUMERIC(5,2),
    preprocessing_time_ms INTEGER,

    -- Verification metrics
    questions_to_match INTEGER,
    verification_duration_seconds INTEGER,

    -- AI metrics
    ai_analysis_time_ms INTEGER,
    ai_model_used TEXT,

    -- Session metrics
    total_duration_seconds INTEGER,
    device_info JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_thumbprint_user_id ON nadi_thumbprint_classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_thumbprint_created_at ON nadi_thumbprint_classifications(created_at);
CREATE INDEX IF NOT EXISTS idx_thumbprint_hash ON nadi_thumbprint_classifications(biometric_hash);

CREATE INDEX IF NOT EXISTS idx_readings_user_id ON nadi_user_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_status ON nadi_user_readings(status);
CREATE INDEX IF NOT EXISTS idx_readings_session_token ON nadi_user_readings(session_token);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON nadi_user_readings(created_at);

CREATE INDEX IF NOT EXISTS idx_questions_reading_id ON nadi_verification_questions(reading_id);
CREATE INDEX IF NOT EXISTS idx_analytics_reading_id ON nadi_reading_analytics(reading_id);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE nadi_thumbprint_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE nadi_user_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nadi_verification_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nadi_reading_analytics ENABLE ROW LEVEL SECURITY;

-- Thumbprint Classifications: Users can only access their own
CREATE POLICY "Users can view own thumbprint classifications"
    ON nadi_thumbprint_classifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own thumbprint classifications"
    ON nadi_thumbprint_classifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User Readings: Users can only access their own readings
CREATE POLICY "Users can view own readings"
    ON nadi_user_readings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings"
    ON nadi_user_readings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readings"
    ON nadi_user_readings FOR UPDATE
    USING (auth.uid() = user_id);

-- Verification Questions: Users can only access questions for their readings
CREATE POLICY "Users can view own verification questions"
    ON nadi_verification_questions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM nadi_user_readings
        WHERE nadi_user_readings.id = nadi_verification_questions.reading_id
        AND nadi_user_readings.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own verification questions"
    ON nadi_verification_questions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM nadi_user_readings
        WHERE nadi_user_readings.id = nadi_verification_questions.reading_id
        AND nadi_user_readings.user_id = auth.uid()
    ));

-- Analytics: Users can only view their own analytics
CREATE POLICY "Users can view own analytics"
    ON nadi_reading_analytics FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM nadi_user_readings
        WHERE nadi_user_readings.id = nadi_reading_analytics.reading_id
        AND nadi_user_readings.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own analytics"
    ON nadi_reading_analytics FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM nadi_user_readings
        WHERE nadi_user_readings.id = nadi_reading_analytics.reading_id
        AND nadi_user_readings.user_id = auth.uid()
    ));

-- ============================================================================
-- Functions for automatic timestamp updates
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_nadi_thumbprint_updated_at
    BEFORE UPDATE ON nadi_thumbprint_classifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nadi_readings_updated_at
    BEFORE UPDATE ON nadi_user_readings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Cleanup function for expired sessions
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_nadi_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM nadi_user_readings
    WHERE status = 'in_progress'
    AND expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE nadi_thumbprint_classifications IS 'Stores thumbprint quality assessment and pattern classification metadata';
COMMENT ON TABLE nadi_user_readings IS 'Main table for Nadi reading sessions with complete analysis results';
COMMENT ON TABLE nadi_verification_questions IS 'Tracks verification questions asked and answers provided during reading';
COMMENT ON TABLE nadi_reading_analytics IS 'Analytics data for system performance and user behavior tracking';

COMMENT ON COLUMN nadi_thumbprint_classifications.biometric_hash IS 'SHA-256 hash of thumbprint (original never stored - GDPR compliant)';
COMMENT ON COLUMN nadi_user_readings.analysis_result IS 'Complete AI-generated Nadi reading output in JSON format';
COMMENT ON COLUMN nadi_user_readings.session_token IS 'Unique token for resuming incomplete readings';

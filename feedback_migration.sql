-- ============================================
-- FEEDBACK TABLE MIGRATION
-- ============================================
-- Run this ONCE in your Supabase SQL Editor
-- This creates the feedback table for BabyTrack
-- ============================================

-- Drop existing table if needed (to start fresh)
DROP TABLE IF EXISTS feedbacks CASCADE;

-- Create feedbacks table
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_created_at ON feedbacks(created_at);

-- Enable Row Level Security
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own feedback" ON feedbacks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback" ON feedbacks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions (service_role bypasses RLS automatically)
GRANT ALL ON feedbacks TO authenticated;
GRANT ALL ON feedbacks TO service_role;

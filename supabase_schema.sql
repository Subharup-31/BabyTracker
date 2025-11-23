-- BabyTracker Database Schema for Supabase
-- This SQL file creates all necessary tables for the BabyTracker application
-- Note: Supabase Auth manages users automatically in auth.users table

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Baby profiles table
CREATE TABLE IF NOT EXISTS baby_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    baby_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT NOT NULL,
    photo_url TEXT,
    blood_group TEXT,
    contact_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth records table
CREATE TABLE IF NOT EXISTS growth_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_baby_profiles_user_id ON baby_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccines_user_id ON vaccines(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_user_id ON growth_records(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE baby_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only access their own data
CREATE POLICY "Users can view their own profile" ON baby_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON baby_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON baby_profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own profile" ON baby_profiles
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own vaccines" ON vaccines
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own vaccines" ON vaccines
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own vaccines" ON vaccines
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own vaccines" ON vaccines
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own growth records" ON growth_records
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own growth records" ON growth_records
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own growth records" ON growth_records
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own growth records" ON growth_records
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view their own chat messages" ON chat_messages
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_baby_profiles_updated_at 
    BEFORE UPDATE ON baby_profiles 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_vaccines_updated_at 
    BEFORE UPDATE ON vaccines 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_growth_records_updated_at 
    BEFORE UPDATE ON growth_records 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
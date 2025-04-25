-- Create the linkedin_profiles table
CREATE TABLE IF NOT EXISTS linkedin_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    profile_data jsonb NOT NULL,
    last_synced timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_user_id ON linkedin_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own LinkedIn profile"
    ON linkedin_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn profile"
    ON linkedin_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own LinkedIn profile"
    ON linkedin_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_linkedin_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_linkedin_profiles_updated_at
    BEFORE UPDATE ON linkedin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_linkedin_profiles_updated_at(); 
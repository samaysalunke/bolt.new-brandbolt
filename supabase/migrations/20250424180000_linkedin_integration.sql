-- Create LinkedIn profile table
CREATE TABLE IF NOT EXISTS linkedin_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    linkedin_id varchar NOT NULL,
    first_name varchar,
    last_name varchar,
    email varchar,
    profile_picture_url text,
    headline varchar,
    industry varchar,
    location json,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id),
    UNIQUE(linkedin_id)
);

-- Create LinkedIn posts table
CREATE TABLE IF NOT EXISTS linkedin_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    linkedin_profile_id uuid REFERENCES linkedin_profiles(id),
    post_urn varchar NOT NULL,
    content text,
    visibility varchar,
    published_at timestamptz,
    likes_count int DEFAULT 0,
    comments_count int DEFAULT 0,
    shares_count int DEFAULT 0,
    impressions_count int DEFAULT 0,
    engagement_rate decimal,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(post_urn)
);

-- Create LinkedIn analytics table
CREATE TABLE IF NOT EXISTS linkedin_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    linkedin_profile_id uuid REFERENCES linkedin_profiles(id),
    date date NOT NULL,
    followers_count int DEFAULT 0,
    impressions_count int DEFAULT 0,
    engagement_rate decimal,
    profile_views int DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(linkedin_profile_id, date)
);

-- Enable RLS
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own LinkedIn profile"
    ON linkedin_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn profile"
    ON linkedin_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own LinkedIn posts"
    ON linkedin_posts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn posts"
    ON linkedin_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own LinkedIn analytics"
    ON linkedin_analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own LinkedIn analytics"
    ON linkedin_analytics FOR UPDATE
    USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_linkedin_profiles_updated_at
    BEFORE UPDATE ON linkedin_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_linkedin_posts_updated_at
    BEFORE UPDATE ON linkedin_posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_linkedin_analytics_updated_at
    BEFORE UPDATE ON linkedin_analytics
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column(); 
-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan_id text NOT NULL,
  status text NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

-- Create trigger
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE
  ON subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
/*
  # Create subscriptions table and related schemas

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `stripe_subscription_id` (text)
      - `stripe_customer_id` (text)
      - `plan_id` (text)
      - `status` (text)
      - `current_period_end` (timestamptz)
      - `cancel_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on subscriptions table
    - Add policies for user access
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_subscription_id text,
  stripe_customer_id text,
  plan_id text NOT NULL,
  status text NOT NULL,
  current_period_end timestamptz,
  cancel_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE
  ON subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
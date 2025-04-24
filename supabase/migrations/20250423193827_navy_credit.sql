/*
  # Enable LinkedIn OIDC Provider

  1. Changes
    - Enables the LinkedIn OIDC provider for authentication
    - Updates existing provider settings if they exist

  2. Security
    - No changes to RLS policies
    - No changes to table permissions
*/

-- Create the auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the auth.providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.providers (
  provider_id text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false
);

-- Enable LinkedIn OIDC provider
INSERT INTO auth.providers (provider_id, enabled)
VALUES ('linkedin_oidc', true)
ON CONFLICT (provider_id)
DO UPDATE SET enabled = true;

-- Disable old LinkedIn provider to avoid conflicts
UPDATE auth.providers
SET enabled = false
WHERE provider_id = 'linkedin';
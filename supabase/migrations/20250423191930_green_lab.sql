/*
  # Enable LinkedIn OAuth Provider

  1. Changes
    - Create auth schema if it doesn't exist
    - Create auth.providers table if it doesn't exist
    - Enable LinkedIn OAuth provider
*/

-- Create the auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the auth.providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.providers (
  provider_id text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false
);

-- Enable LinkedIn OAuth provider
INSERT INTO auth.providers (provider_id, enabled)
VALUES ('linkedin', true)
ON CONFLICT (provider_id)
DO UPDATE SET enabled = true;
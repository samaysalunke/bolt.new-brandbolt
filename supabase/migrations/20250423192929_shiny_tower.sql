/*
  # Enable LinkedIn OIDC provider

  1. Changes
    - Creates auth schema if it doesn't exist
    - Creates auth.providers table if it doesn't exist
    - Enables LinkedIn OIDC provider
  
  2. Security
    - No RLS needed as this is a system table
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
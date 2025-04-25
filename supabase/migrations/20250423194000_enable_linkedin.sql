-- Enable LinkedIn OIDC provider and configure it
DO $$
BEGIN
    -- First, ensure the auth schema exists
    CREATE SCHEMA IF NOT EXISTS auth;

    -- Drop existing providers table if it exists
    DROP TABLE IF EXISTS auth.providers;

    -- Create the providers table with the correct schema
    CREATE TABLE auth.providers (
        provider_id text PRIMARY KEY,
        enabled boolean DEFAULT false,
        client_id text,
        secret text,
        redirect_uri text,
        metadata jsonb DEFAULT '{}'::jsonb
    );

    -- Insert or update the LinkedIn OIDC provider
    INSERT INTO auth.providers (
        provider_id,
        enabled,
        client_id,
        secret,
        redirect_uri,
        metadata
    )
    VALUES (
        'linkedin_oidc',
        true,
        current_setting('auth.linkedin_client_id', true),
        current_setting('auth.linkedin_secret', true),
        'http://localhost:5173/auth/callback',
        jsonb_build_object(
            'scopes', ARRAY['openid', 'profile', 'email', 'w_member_social'],
            'authorization_endpoint', 'https://www.linkedin.com/oauth/v2/authorization',
            'token_endpoint', 'https://www.linkedin.com/oauth/v2/accessToken',
            'userinfo_endpoint', 'https://api.linkedin.com/v2/userinfo'
        )
    )
    ON CONFLICT (provider_id) DO UPDATE
    SET
        enabled = true,
        client_id = EXCLUDED.client_id,
        secret = EXCLUDED.secret,
        redirect_uri = EXCLUDED.redirect_uri,
        metadata = EXCLUDED.metadata;
END $$; 
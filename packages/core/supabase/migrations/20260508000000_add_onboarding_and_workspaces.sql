-- Add onboarding columns to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS user_type            TEXT CHECK (user_type IN ('freelancer', 'agency', 'sales_team', 'founder', 'other'));

-- Grandfather all existing users as already verified and onboarded
-- UPDATE users SET email_verified = true, onboarding_completed = true;

-- Email verification tokens (24-hour expiry, consumed on use)
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  token      TEXT        PRIMARY KEY,
  email      TEXT        NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_evt_email   ON email_verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_evt_expires ON email_verification_tokens(expires_at);

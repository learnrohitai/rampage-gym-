-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id              TEXT PRIMARY KEY,
  reg_id          TEXT NOT NULL,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  dob             TEXT NOT NULL,
  gender          TEXT NOT NULL,
  city            TEXT NOT NULL,
  gym             TEXT NOT NULL,
  category        TEXT NOT NULL,
  category_meta   JSONB NOT NULL DEFAULT '{}',
  payment_ref     TEXT NOT NULL,
  receipt_file    TEXT,
  receipt_original_name TEXT,
  payment_status  TEXT NOT NULL DEFAULT 'unverified',
  status          TEXT NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes           TEXT
);

-- Create storage bucket for receipts (run in Storage UI or via SQL)
-- Note: Buckets must be created via the Dashboard UI or REST API, not SQL.
-- After creating the "receipts" bucket in Storage UI, run:

-- Make the bucket public so uploaded files are accessible via URL
ALTER BUCKET receipts IS PUBLIC;

-- Enable Row Level Security (optional — service_role key bypasses RLS anyway)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Run this in Supabase SQL Editor to add athlete photo columns
-- (only needed if the table was created before the photo upload feature)

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS photo_file TEXT,
  ADD COLUMN IF NOT EXISTS photo_original_name TEXT;

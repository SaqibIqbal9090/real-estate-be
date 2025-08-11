-- Simple script to add the rooms column to properties table
-- Run this in your PostgreSQL database

ALTER TABLE properties ADD COLUMN IF NOT EXISTS "rooms" JSON;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name = 'rooms'; 
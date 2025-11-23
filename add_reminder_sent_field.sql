-- Add reminder_sent field to vaccines table
-- This prevents sending duplicate reminder emails

ALTER TABLE vaccines 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

-- Update existing vaccines to have reminder_sent = false
UPDATE vaccines 
SET reminder_sent = FALSE 
WHERE reminder_sent IS NULL;

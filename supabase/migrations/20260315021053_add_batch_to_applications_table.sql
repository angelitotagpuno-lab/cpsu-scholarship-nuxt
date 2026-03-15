ALTER TABLE applications
ADD COLUMN batch TEXT,
ADD COLUMN award_no TEXT,
ADD COLUMN app_no TEXT;

CREATE UNIQUE INDEX unique_approved_application
ON applications(id)
WHERE status = 'approved';

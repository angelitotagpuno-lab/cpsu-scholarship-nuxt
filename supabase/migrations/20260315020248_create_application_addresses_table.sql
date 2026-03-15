CREATE TABLE application_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID
        REFERENCES applications(id) ON DELETE CASCADE,

    street TEXT,
    barangay TEXT,
    zipcode TEXT
);
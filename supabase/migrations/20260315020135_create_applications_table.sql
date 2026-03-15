CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES students(id) ON DELETE CASCADE,

    seq INTEGER,
    program_name TEXT NOT NULL,
    year_level INTEGER NOT NULL,

    has_disability BOOLEAN DEFAULT false,
    has_ip_group BOOLEAN DEFAULT false,

    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected')),

    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_app_student ON applications(student_id);
CREATE INDEX idx_app_status ON applications(status);
CREATE INDEX idx_app_program ON applications(program_name);
CREATE INDEX idx_app_year ON applications(year_level);

CREATE UNIQUE INDEX unique_pending_application
ON applications(student_id)
WHERE status = 'pending';

CREATE INDEX idx_application_filter
ON applications(status, program_name, year_level);
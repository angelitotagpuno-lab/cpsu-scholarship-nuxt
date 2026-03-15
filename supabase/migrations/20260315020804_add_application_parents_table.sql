CREATE TABLE application_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID
        REFERENCES applications(id) ON DELETE CASCADE,

    type TEXT CHECK (type IN ('father','mother')),

    last_name TEXT,
    given_name TEXT,
    middle_name TEXT
);

CREATE INDEX idx_parent_app ON application_parents(application_id);

CREATE INDEX idx_app_created_at ON applications(created_at DESC);

CREATE INDEX idx_app_student_status
ON applications(student_id, status);

CREATE INDEX idx_app_program_year
ON applications(program_name, year_level);
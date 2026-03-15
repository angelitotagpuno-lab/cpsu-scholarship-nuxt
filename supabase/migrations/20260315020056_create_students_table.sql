CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT UNIQUE NOT NULL,

    last_name TEXT NOT NULL,
    given_name TEXT NOT NULL,
    middle_name TEXT,
    ext_name TEXT,

    sex TEXT CHECK (sex IN ('male','female')),
    birthdate DATE,

    contact_number TEXT,
    email TEXT UNIQUE,

    created_at TIMESTAMP DEFAULT now()
);
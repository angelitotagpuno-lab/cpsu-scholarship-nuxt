-- PROGRAM TYPES (TDP, TES)
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- 'TDP' | 'TES'
    name TEXT NOT NULL
);

-- STUDENTS (identity-level data)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_identifier TEXT, -- STUDENT ID or App No.
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    ext_name TEXT,

    sex TEXT CHECK (sex IN ('Male', 'Female')),
    contact TEXT,
    email TEXT,

    street TEXT,
    city TEXT,
    province TEXT,
    zipcode TEXT,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Prevent duplicate student identity
CREATE UNIQUE INDEX students_unique_identity
ON students (student_identifier);

-- UPLOAD TRACKING
CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    program_id INTEGER REFERENCES programs(id),
    academic_year TEXT,
    semester TEXT,
    uploaded_at TIMESTAMP DEFAULT now()
);

-- ENROLLMENTS (per semester per program)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES programs(id),

    course TEXT NOT NULL,
    year_level INTEGER,
    batch TEXT,

    award_no TEXT,
    app_no TEXT,

    upload_id UUID REFERENCES uploads(id),

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Prevent duplicate enrollment per student + semester
CREATE UNIQUE INDEX enrollments_unique
ON enrollments (student_id, program_id, batch);

CREATE INDEX idx_enrollments_course ON enrollments(course);
CREATE INDEX idx_enrollments_year_level ON enrollments(year_level);
CREATE INDEX idx_enrollments_batch ON enrollments(batch);
CREATE INDEX idx_enrollments_program ON enrollments(program_id);

CREATE INDEX idx_students_city ON students(city);
CREATE INDEX idx_students_province ON students(province);

-- Composite for dashboard filtering
CREATE INDEX idx_filter_combo
ON enrollments (program_id, batch, course, year_level);
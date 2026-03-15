ALTER TABLE students
ADD CONSTRAINT students_auth_fk
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

CREATE INDEX students_sex_idx ON students(sex);
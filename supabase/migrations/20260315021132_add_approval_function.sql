CREATE OR REPLACE FUNCTION approve_application_tx(
    p_application_id UUID,
    p_program_id INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_app RECORD;
    v_scholar_id UUID;
BEGIN
    -- lock application
    SELECT * INTO v_app
    FROM applications
    WHERE id = p_application_id
    FOR UPDATE;

    IF v_app.status <> 'pending' THEN
        RAISE EXCEPTION 'Application already processed';
    END IF;

    -- update status
    UPDATE applications
    SET status = 'approved'
    WHERE id = p_application_id;

    -- upsert scholar identity
    INSERT INTO scholars (
        id,
        scholar_identifier,
        last_name,
        first_name,
        middle_name,
        ext_name,
        sex,
        contact,
        email,
        street,
        zipcode
    )
    SELECT
        s.id,
        s.student_id,
        s.last_name,
        s.given_name,
        s.middle_name,
        s.ext_name,
        s.sex,
        s.contact_number,
        s.email,
        a.street,
        a.zipcode
    FROM students s
    JOIN application_addresses a ON a.application_id = p_application_id
    WHERE s.id = v_app.student_id
    ON CONFLICT (id) DO NOTHING;

    -- insert enrollment
    INSERT INTO enrollments (
        scholar_id,
        program_id,
        course,
        year_level,
        batch,
        award_no,
        app_no
    )
    VALUES (
        v_app.student_id,
        p_program_id,
        v_app.program_name,
        v_app.year_level,
        v_app.batch,
        v_app.award_no,
        v_app.app_no
    );

END;
$$;

CREATE INDEX pending_queue_fast
ON applications(status, created_at DESC)
WHERE status = 'pending';
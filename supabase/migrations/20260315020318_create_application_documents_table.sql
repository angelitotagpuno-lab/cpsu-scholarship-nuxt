CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID
        REFERENCES applications(id) ON DELETE CASCADE,

    type TEXT CHECK (type IN ('disability','ip_group')),
    file_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_docs_app ON application_documents(application_id);
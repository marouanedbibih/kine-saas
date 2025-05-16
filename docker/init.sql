-- Connect to PostgreSQL as postgres user
\c postgres postgres

-- Create the patient_db database
CREATE DATABASE patient_db;

-- Grant privileges on the database to postgres (who is already the owner as superuser)
COMMENT ON DATABASE patient_db IS 'Database for patient management system';

-- Connect to the newly created database
\c patient_db postgres

-- Optionally create a schema
CREATE SCHEMA IF NOT EXISTS patient_schema;

-- Set default permissions
ALTER DATABASE patient_db SET search_path TO patient_schema, public;

-- Output confirmation
\echo 'Database patient_db has been created successfully'
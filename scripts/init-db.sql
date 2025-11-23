-- Finance4All Database Initialization Script
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a test table to verify database is working
CREATE TABLE IF NOT EXISTS health_check (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test record
INSERT INTO health_check (service_name, status)
VALUES ('finance4all-backend', 'initialized')
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO finance4all_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO finance4all_user;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Finance4All database initialized successfully!';
    RAISE NOTICE 'Database: finance4all';
    RAISE NOTICE 'User: finance4all_user';
    RAISE NOTICE 'Extensions: uuid-ossp, pgcrypto';
END $$;

-- Initialize required PostgreSQL extensions for Knowra
-- pg_trgm is used for fuzzy search, Bengali character matching, and trigram indexing.
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

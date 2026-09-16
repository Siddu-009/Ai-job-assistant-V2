-- =====================================================
-- AI JOB ASSISTANT DATABASE SCHEMA
-- PostgreSQL
-- =====================================================

-- ==========================
-- USERS
-- ==========================

CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================
-- RESUMES
-- ==========================

CREATE TABLE IF NOT EXISTS resumes (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    filename TEXT NOT NULL,

    resume_text TEXT,

    skills TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================
-- GENERATED RESUMES
-- ==========================

CREATE TABLE IF NOT EXISTS generated_resumes (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    job_description TEXT,

    generated_resume TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================
-- JOBS
-- ==========================

CREATE TABLE IF NOT EXISTS jobs (

    id SERIAL PRIMARY KEY,

    provider_job_id VARCHAR(255) NOT NULL,

    title VARCHAR(255),

    company VARCHAR(255),

    location VARCHAR(255),

    description TEXT,

    employment_type VARCHAR(100),

    salary VARCHAR(255),

    experience VARCHAR(255),

    source VARCHAR(150) NOT NULL,

    apply_url TEXT,

    remote BOOLEAN DEFAULT FALSE,

    posted_date VARCHAR(100),

    company_logo TEXT,

    company_url TEXT,

    country VARCHAR(100),

    skills TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(provider_job_id, source)

);

CREATE INDEX IF NOT EXISTS idx_jobs_title
ON jobs(title);

CREATE INDEX IF NOT EXISTS idx_jobs_company
ON jobs(company);

CREATE INDEX IF NOT EXISTS idx_jobs_location
ON jobs(location);

CREATE INDEX IF NOT EXISTS idx_jobs_source
ON jobs(source);

CREATE INDEX IF NOT EXISTS idx_jobs_provider
ON jobs(provider_job_id);

-- ==========================
-- APPLICATIONS
-- ==========================

CREATE TABLE IF NOT EXISTS applications (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    resume_id INTEGER REFERENCES resumes(id),

    job_id INTEGER REFERENCES jobs(id),

    status VARCHAR(100) DEFAULT 'Applied',

    remarks TEXT DEFAULT '',

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================
-- RECOMMENDED JOBS
-- ==========================

CREATE TABLE IF NOT EXISTS recommended_jobs (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    job_id INTEGER REFERENCES jobs(id),

    score INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================
-- SAVED JOBS
-- ==========================

CREATE TABLE IF NOT EXISTS saved_jobs (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    job_id INTEGER REFERENCES jobs(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================
-- USER ALERTS
-- ==========================

CREATE TABLE IF NOT EXISTS user_alerts (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    email VARCHAR(255),

    enabled BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- COVER LETTERS
-- =====================================================

CREATE TABLE IF NOT EXISTS cover_letters (

    id SERIAL PRIMARY KEY,

    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,

    company VARCHAR(255),

    job_title VARCHAR(255),

    cover_letter TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- CAREER ROADMAPS
-- =====================================================

CREATE TABLE IF NOT EXISTS career_roadmaps (

    id SERIAL PRIMARY KEY,

    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,

    target_role VARCHAR(255),

    roadmap TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- INTERVIEW QUESTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_questions (

    id SERIAL PRIMARY KEY,

    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,

    question TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- INTERVIEW ANSWERS
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_answers (

    id SERIAL PRIMARY KEY,

    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,

    question TEXT,

    answer TEXT,

    score INTEGER,

    feedback TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- RESUME VERSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS resume_versions (

    id SERIAL PRIMARY KEY,

    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,

    version_name VARCHAR(255),

    resume_text TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- ACTIVITY LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (

    id SERIAL PRIMARY KEY,

    resume_id INTEGER REFERENCES resumes(id),

    activity_type VARCHAR(255),

    details TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- JOB ALERTS
-- =====================================================

CREATE TABLE IF NOT EXISTS job_alerts (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    job_title VARCHAR(255),

    company VARCHAR(255),

    location VARCHAR(255),

    apply_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- ADMINS
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (

    id SERIAL PRIMARY KEY,

    username VARCHAR(100) UNIQUE,

    password VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

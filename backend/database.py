import sqlite3
import json
from datetime import datetime
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Jobs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            company_logo TEXT,
            location TEXT,
            experience_level TEXT,
            job_type TEXT,
            workplace_type TEXT,
            skills TEXT,
            description TEXT,
            responsibilities TEXT,
            qualifications TEXT,
            apply_url TEXT,
            source TEXT DEFAULT 'Verified Portal',
            posted_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Saved Jobs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id TEXT PRIMARY KEY,
            job_id TEXT NOT NULL,
            user_id TEXT DEFAULT 'default_user',
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(job_id, user_id)
        )
    """)

    # Application Tracker Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            job_id TEXT,
            company TEXT NOT NULL,
            job_title TEXT NOT NULL,
            location TEXT,
            apply_url TEXT,
            status TEXT NOT NULL DEFAULT 'Saved',
            applied_date TEXT,
            notes TEXT,
            salary_range TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # User Profile Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profile (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            education TEXT,
            skills TEXT,
            experience TEXT,
            preferred_role TEXT,
            preferred_location TEXT,
            resume_name TEXT,
            resume_data TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Search Activity Logs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS search_logs (
            id TEXT PRIMARY KEY,
            query TEXT,
            company TEXT,
            results_count INTEGER,
            status TEXT,
            source TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()

    # Seed default user profile if not present
    cursor.execute("SELECT COUNT(*) as cnt FROM user_profile WHERE id = 'default_user'")
    row = cursor.fetchone()
    if row["cnt"] == 0:
        cursor.execute("""
            INSERT INTO user_profile (
                id, full_name, email, education, skills, experience,
                preferred_role, preferred_location, resume_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "default_user",
            "Alex Morgan",
            "alex.morgan@university.edu",
            "B.Tech in Computer Science & Engineering (2025)",
            json.dumps(["React", "Python", "FastAPI", "JavaScript", "TypeScript", "Tailwind CSS", "Machine Learning", "SQL", "Git"]),
            "1 year internship experience in Frontend & AI integrations",
            "Full Stack Engineer / AI Software Intern",
            "Remote / Bengaluru / Hyderabad",
            "Alex_Morgan_Software_Resume.pdf"
        ))
        conn.commit()

    conn.close()

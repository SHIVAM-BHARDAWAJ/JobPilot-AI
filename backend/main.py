
    cursor.execute("DELETE FROM applications WHERE id = ?", (app_id,))
    conn.commit()
    conn.close()
    return {"message": "Application removed from tracker", "id": app_id}

@app.get("/api/profile")
def get_user_profile():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_profile WHERE id = 'default_user'")
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {
            "id": "default_user",
            "full_name": "Alex Morgan",
            "email": "alex.morgan@university.edu",
            "education": "B.Tech in Computer Science & Engineering (2025)",
            "skills": ["React", "Python", "FastAPI", "JavaScript", "TypeScript"],
            "experience": "1 year internship experience in Frontend & AI integrations",
            "preferred_role": "Full Stack Engineer / AI Software Intern",
            "preferred_location": "Remote / Bengaluru / Hyderabad",
            "resume_name": "Alex_Morgan_Software_Resume.pdf"
        }

    skills = []
    if row["skills"]:
        try:
            skills = json.loads(row["skills"])
        except Exception:
            skills = [s.strip() for s in row["skills"].split(",") if s.strip()]

    return {
        "id": row["id"],
        "full_name": row["full_name"],
        "email": row["email"],
        "education": row["education"] or "",
        "skills": skills,
        "experience": row["experience"] or "",
        "preferred_role": row["preferred_role"] or "",
        "preferred_location": row["preferred_location"] or "",
        "resume_name": row["resume_name"] or "",
        "updated_at": row["updated_at"]
    }

@app.put("/api/profile")
def update_user_profile(payload: UserProfileUpdate):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE user_profile 
        SET full_name = ?, email = ?, education = ?, skills = ?, experience = ?,
            preferred_role = ?, preferred_location = ?,
            resume_name = COALESCE(?, resume_name),
            resume_data = COALESCE(?, resume_data),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 'default_user'
    """, (
        payload.full_name, payload.email, payload.education, json.dumps(payload.skills),
        payload.experience, payload.preferred_role, payload.preferred_location,
        payload.resume_name, payload.resume_data
    ))
    conn.commit()
    conn.close()

    return {"message": "Profile updated successfully"}

@app.post("/api/profile/resume")
async def upload_resume(file: UploadFile = File(...)):
    """Simulates resume parsing and extracts matched skills."""
    filename = file.filename
    # Read snippet
    contents = await file.read()

    # Detected skills from sample keyword scanning
    detected = ["React", "Python", "FastAPI", "JavaScript", "TypeScript", "SQL", "Git", "Docker", "REST APIs", "AWS"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE user_profile 
        SET resume_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 'default_user'
    """, (filename,))
    conn.commit()
    conn.close()

    return {
        "message": "Resume uploaded and analyzed successfully!",
        "filename": filename,
        "file_size_bytes": len(contents),
        "detected_skills": detected
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    logger.info(f"Starting JobPilot FastAPI server on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=False)

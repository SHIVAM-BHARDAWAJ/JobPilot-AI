import pytest
import io
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app
from database import get_db, init_db
from seed_data import seed_jobs_if_empty

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    seed_jobs_if_empty()

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "JobPilot" in data["platform"]

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "tinyfish" in data

def test_status_endpoint_never_exposes_key():
    res = client.get("/api/status")
    assert res.status_code == 200
    data = res.json()
    assert "tinyfish" in data
    assert "database" in data
    assert data["database"]["status"] == "connected"
    assert data["database"]["total_jobs"] >= 10
    # Security check: check masked_key
    masked = data["tinyfish"]["masked_key"]
    assert "••••" in masked or masked == ""
    # Ensure raw secret is not returned
    assert "sk-tinyfish-X4i" not in res.text

def test_companies_endpoint():
    res = client.get("/api/companies")
    assert res.status_code == 200
    companies = res.json()
    assert len(companies) >= 10
    names = [c["name"] for c in companies]
    assert "Google" in names
    assert "Amazon" in names
    assert "Microsoft" in names
    assert "Adobe" in names
    assert "Deloitte" in names

def test_dashboard_stats_endpoint():
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    data = res.json()
    assert "total_jobs_discovered" in data
    assert "jobs_matching_skills" in data
    assert "recent_jobs" in data
    assert len(data["recent_jobs"]) > 0

def test_jobs_list_and_filters():
    # 1. Get all jobs
    res = client.get("/api/jobs")
    assert res.status_code == 200
    all_jobs = res.json()["jobs"]
    assert len(all_jobs) >= 10

    # 2. Filter by company
    res_goog = client.get("/api/jobs?company=Google")
    assert res_goog.status_code == 200
    for j in res_goog.json()["jobs"]:
        assert j["company"].lower() == "google"

    # 3. Filter by experience
    res_intern = client.get("/api/jobs?experience_level=Internship")
    assert res_intern.status_code == 200
    for j in res_intern.json()["jobs"]:
        assert j["experience_level"].lower() == "internship"

    # 4. Multi-word search tokenized
    res_search = client.get("/api/jobs?q=Amazon Software Development")
    assert res_search.status_code == 200
    jobs = res_search.json()["jobs"]
    assert len(jobs) >= 1
    assert any("Amazon" in j["company"] for j in jobs)

def test_job_detail_endpoint():
    # Existing job
    res = client.get("/api/jobs/job-goog-01")
    assert res.status_code == 200
    job = res.json()
    assert job["id"] == "job-goog-01"
    assert job["company"] == "Google"
    assert len(job["skills"]) > 0
    assert len(job["responsibilities"]) > 0
    assert len(job["qualifications"]) > 0

    # Non-existent job
    res_404 = client.get("/api/jobs/non-existent-id")
    assert res_404.status_code == 404

def test_save_and_unsave_job():
    job_id = "job-amzn-01"

    # Initial state check
    res_initial = client.get(f"/api/jobs/{job_id}")
    was_saved = res_initial.json()["is_saved"]

    # Toggle 1
    res1 = client.post(f"/api/jobs/{job_id}/save")
    assert res1.status_code == 200
    is_saved_1 = res1.json()["is_saved"]
    assert is_saved_1 == (not was_saved)

    # Toggle 2 (reverse)
    res2 = client.post(f"/api/jobs/{job_id}/save")
    assert res2.status_code == 200
    is_saved_2 = res2.json()["is_saved"]
    assert is_saved_2 == was_saved

    # Non-existent job save should return 404
    res_invalid = client.post("/api/jobs/invalid-job-999/save")
    assert res_invalid.status_code == 404

def test_saved_jobs_list():
    res = client.get("/api/jobs/saved")
    assert res.status_code == 200
    assert "saved_jobs" in res.json()

def test_application_tracker_crud():
    # 1. Create Application
    payload = {
        "company": "Amazon",
        "job_title": "Software Development Engineer - AWS",
        "location": "Bengaluru, India",
        "status": "Applied",
        "salary_range": "₹24,00,000 / year",
        "notes": "Passed technical phone screening."
    }
    create_res = client.post("/api/applications", json=payload)
    assert create_res.status_code == 200
    app_id = create_res.json()["id"]
    assert app_id.startswith("app-")

    # 2. Update Application Status to Interview
    update_res = client.patch(f"/api/applications/{app_id}", json={
        "status": "Interview",
        "notes": "System design round scheduled for next Monday."
    })
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "Interview"

    # 3. Verify in List
    list_res = client.get("/api/applications")
    assert list_res.status_code == 200
    apps = list_res.json()["applications"]
    matched = [a for a in apps if a["id"] == app_id]
    assert len(matched) == 1
    assert matched[0]["status"] == "Interview"
    assert "System design" in matched[0]["notes"]

    # 4. Delete Application
    del_res = client.delete(f"/api/applications/{app_id}")
    assert del_res.status_code == 200

    # 5. Non-existent delete should return 404
    del_again = client.delete(f"/api/applications/{app_id}")
    assert del_again.status_code == 404

def test_user_profile_crud():
    # 1. Get profile
    res = client.get("/api/profile")
    assert res.status_code == 200
    prof = res.json()
    assert "full_name" in prof
    assert "skills" in prof

    # 2. Update profile
    new_profile = {
        "full_name": "Alex QA Engineer",
        "email": "alex.qa@university.edu",
        "education": "M.S. in Software Systems",
        "skills": ["Python", "PyTest", "React", "FastAPI", "TypeScript", "Docker"],
        "experience": "2 years automated testing and full stack dev",
        "preferred_role": "Software Development Engineer in Test (SDET)",
        "preferred_location": "Bengaluru / Remote"
    }
    put_res = client.put("/api/profile", json=new_profile)
    assert put_res.status_code == 200

    # 3. Verify updated profile
    check_res = client.get("/api/profile")
    updated = check_res.json()
    assert updated["full_name"] == "Alex QA Engineer"
    assert "PyTest" in updated["skills"]

def test_resume_upload():
    file_content = b"Resume of Alex QA. Skills: Python, FastAPI, React, PyTest, SQL, Docker, AWS."
    files = {"file": ("Alex_Resume.pdf", io.BytesIO(file_content), "application/pdf")}
    res = client.post("/api/profile/resume", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["filename"] == "Alex_Resume.pdf"
    assert len(data["detected_skills"]) > 0

def test_api_key_update():
    res = client.post("/api/status/key", json={"api_key": "sk-tinyfish-newtestkey12345"})
    assert res.status_code == 200
    assert res.json()["status"]["configured"] is True

    # Empty key validation
    res_empty = client.post("/api/status/key", json={"api_key": "   "})
    assert res_empty.status_code == 400

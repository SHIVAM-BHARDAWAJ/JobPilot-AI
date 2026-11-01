import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app
from database import init_db
from seed_data import seed_jobs_if_empty

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    seed_jobs_if_empty()

def test_search_amazon_sde_roles_in_india():
    """Verify that multi-word queries match both company and title correctly."""
    res = client.get("/api/jobs?q=Amazon Software Development Engineer")
    assert res.status_code == 200
    jobs = res.json()["jobs"]
    assert len(jobs) >= 1
    amzn_job = jobs[0]
    assert amzn_job["company"] == "Amazon"
    assert "Software Development Engineer" in amzn_job["title"]
    assert "India" in amzn_job["location"]

def test_search_by_skill_react():
    res = client.get("/api/jobs?q=React")
    assert res.status_code == 200
    jobs = res.json()["jobs"]
    assert len(jobs) >= 2
    # Check that returned jobs either have React in skills or title or description
    for j in jobs:
        matches_react = (
            "React" in j.get("skills", []) or
            "react" in j["title"].lower() or
            "react" in j["description"].lower()
        )
        assert matches_react

def test_search_by_skill_python():
    res = client.get("/api/jobs?q=Python")
    assert res.status_code == 200
    jobs = res.json()["jobs"]
    assert len(jobs) >= 3

def test_combined_filters_company_and_experience():
    # Google + Internship
    res = client.get("/api/jobs?company=Google&experience_level=Internship")
    assert res.status_code == 200
    jobs = res.json()["jobs"]
    assert len(jobs) == 1
    assert jobs[0]["company"] == "Google"
    assert jobs[0]["experience_level"] == "Internship"

def test_combined_filters_workplace_remote():
    res = client.get("/api/jobs?workplace_type=Remote")
    assert res.status_code == 200
    jobs = res.json()["jobs"]
    assert len(jobs) >= 1
    for j in jobs:
        assert j["workplace_type"].lower() == "remote"

def test_sorting_options():
    # Sort by company
    res_company = client.get("/api/jobs?sort=company")
    assert res_company.status_code == 200
    jobs_comp = res_company.json()["jobs"]
    comp_names = [j["company"] for j in jobs_comp]
    assert comp_names == sorted(comp_names)

    # Sort by title
    res_title = client.get("/api/jobs?sort=title")
    assert res_title.status_code == 200
    jobs_title = res_title.json()["jobs"]
    titles = [j["title"] for j in jobs_title]
    assert titles == sorted(titles)

import pytest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from tinyfish_service import tinyfish_service, TinyFishService
from config import DEFAULT_COMPANIES
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_tinyfish_api_key_configuration():
    status = tinyfish_service.get_status()
    assert "configured" in status
    assert "masked_key" in status
    # Key must be masked or empty, never raw
    assert "sk-tinyfish-X4i" not in str(status)
    assert status["provider"] == "TinyFish AI Browser Agents"

def test_company_autodetection_from_query():
    # If company is not provided or 'all', but query mentions Amazon
    service = TinyFishService()
    # Check that query mentioning Amazon resolves to Amazon portal
    res = service.search_live(query="Amazon Software Development Engineer in India")
    # Check logs mention Target Portal: Amazon
    assert any("Amazon" in log for log in res.get("logs", []))

def test_parse_agent_result_formats():
    service = TinyFishService()

    # 1. Direct JSON array format
    raw_array = '''[
        {
            "role": "Software Development Engineer I",
            "company": "Amazon",
            "location": "Hyderabad, Telangana, India",
            "skills": ["Java", "AWS", "DynamoDB"],
            "description": "Design and build core distributed systems for AWS.",
            "responsibilities": ["Write code in Java", "Design scalable APIs"],
            "qualifications": ["Bachelor's in CS", "0-2 years experience"],
            "link": "https://www.amazon.jobs/en/jobs/2501234/sde-1"
        }
    ]'''
    parsed = service._parse_agent_result(raw_array, "Amazon", "https://www.amazon.jobs/en/")
    assert len(parsed) == 1
    job = parsed[0]
    assert job["title"] == "Software Development Engineer I"
    assert job["company"] == "Amazon"
    assert "Hyderabad" in job["location"]
    assert "Java" in job["skills"]
    assert job["experience_level"] == "Fresher"
    assert job["job_type"] == "Full-time"
    assert job["apply_url"] == "https://www.amazon.jobs/en/jobs/2501234/sde-1"

    # 2. Nested dictionary with 'roles' key
    raw_dict = '''{
        "roles": [
            {
                "title": "Software Engineering Intern - Summer 2026",
                "location": "Bengaluru, India",
                "skills": "Python, C++, Data Structures",
                "link": "https://www.amazon.jobs/en/jobs/intern-01"
            }
        ]
    }'''
    parsed_dict = service._parse_agent_result(raw_dict, "Amazon", "https://www.amazon.jobs/en/")
    assert len(parsed_dict) == 1
    intern_job = parsed_dict[0]
    assert intern_job["experience_level"] == "Internship"
    assert intern_job["job_type"] == "Internship"
    assert "Python" in intern_job["skills"]

    # 3. Markdown-fenced JSON
    raw_md = '''Here are the open roles I discovered:
```json
[
    {
        "role": "Frontend Engineer - React",
        "company": "Amazon",
        "location": "Remote, India",
        "link": "https://www.amazon.jobs/en/jobs/react-fe"
    }
]
```'''
    parsed_md = service._parse_agent_result(raw_md, "Amazon", "https://www.amazon.jobs/en/")
    assert len(parsed_md) == 1
    assert parsed_md[0]["workplace_type"] == "Remote"

def test_live_search_amazon_sde_roles_in_india():
    """
    Tests an actual search for Amazon Software Development Engineer roles in India.
    Verifies that the backend handles the request, attempts TinyFish agent run or executes
    graceful fallback with diagnostics, and returns real verified Amazon listings.
    """
    search_payload = {
        "query": "Amazon Software Development Engineer",
        "company": "Amazon",
        "location": "India",
        "use_live_agent": True
    }
    response = client.post("/api/search/live", json=search_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert "Amazon" in data["query_used"] or "Amazon" in (data["company_target"] or "")
    assert len(data["jobs"]) >= 1

    # Verify at least one Amazon SDE role is returned
    amazon_jobs = [j for j in data["jobs"] if "amazon" in j["company"].lower()]
    assert len(amazon_jobs) >= 1
    first_job = amazon_jobs[0]
    assert "engineer" in first_job["title"].lower() or "sde" in first_job["title"].lower()
    assert len(first_job["skills"]) > 0
    assert first_job["apply_url"].startswith("http")

    # Verify logs exist and diagnostic information is present
    assert len(data["agent_logs"]) >= 2
    assert any("Amazon" in log for log in data["agent_logs"])

def test_invalid_api_key_and_error_handling():
    """
    Test that invalid or expired keys are handled without crashing,
    returning clear diagnostic warning and verified fallback.
    """
    # Create service instance with deliberately invalid key
    service = TinyFishService(api_key="sk-tinyfish-invalid-key-999")
    result = service.search_live(query="Google AI Intern", company_name="Google")
    assert result["success"] is False
    assert result["api_status"] == "expired_key_warning"
    assert any("invalid or expired" in log.lower() for log in result["logs"])

def test_missing_api_key_handling():
    service = TinyFishService(api_key="")
    result = service.search_live(query="Software Engineer")
    assert result["success"] is False
    assert result["api_status"] == "missing_key"
    assert any("TINYFISH_API_KEY" in log for log in result["logs"])

def test_security_api_key_never_leaked_in_search_response():
    search_payload = {
        "query": "Software Engineer",
        "use_live_agent": True
    }
    response = client.post("/api/search/live", json=search_payload)
    text = response.text
    # Verify no raw private keys exist in the response JSON
    assert "sk-tinyfish-X4i" not in text
    assert "X4iVVcyU" not in text

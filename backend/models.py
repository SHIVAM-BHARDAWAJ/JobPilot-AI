from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SearchRequest(BaseModel):
    query: Optional[str] = ""
    company: Optional[str] = ""
    career_url: Optional[str] = ""
    location: Optional[str] = ""
    experience_level: Optional[str] = ""
    job_type: Optional[str] = ""
    workplace_type: Optional[str] = ""
    use_live_agent: bool = True
    timeout_seconds: Optional[int] = 60

class JobItem(BaseModel):
    id: str
    title: str
    company: str
    company_logo: Optional[str] = None
    location: Optional[str] = "Location not specified"
    experience_level: Optional[str] = "All Levels"
    job_type: Optional[str] = "Full-time"
    workplace_type: Optional[str] = "Hybrid"
    skills: List[str] = []
    description: Optional[str] = ""
    responsibilities: List[str] = []
    qualifications: List[str] = []
    apply_url: str
    source: Optional[str] = "Verified Portal"
    posted_date: Optional[str] = "Recently"
    is_saved: Optional[bool] = False
    is_live: Optional[bool] = False
    data_badge: Optional[str] = "DEMO DATA"
    extracted_at: Optional[str] = None
    run_id: Optional[str] = None

class SearchResponse(BaseModel):
    success: bool
    source: str  # "TinyFish AI Browser Agent" or "JobPilot Demo Repository"
    query_used: str
    company_target: Optional[str] = None
    target_portal_url: Optional[str] = None
    jobs: List[JobItem]
    total_found: int
    duration_seconds: float
    message: str
    agent_logs: List[str] = []
    api_status: str  # "connected", "fallback", "expired_key_warning"
    is_live: bool = False
    search_mode: str = "DEMO_DATA"  # "LIVE_TINYFISH" | "LIVE_PORTAL" | "DEMO_DATA"
    agent_status: str = "DEMO_FALLBACK"  # "COMPLETED" | "FAILED_EXPIRED_KEY" | "TIMEOUT" | "ERROR" | "DEMO_FALLBACK"
    agent_error_detail: Optional[str] = None
    jobs_extracted_count: int = 0

class ApplicationCreate(BaseModel):
    job_id: Optional[str] = None
    company: str
    job_title: str
    location: Optional[str] = ""
    apply_url: Optional[str] = ""
    status: str = "Saved"
    applied_date: Optional[str] = None
    notes: Optional[str] = ""
    salary_range: Optional[str] = ""

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    salary_range: Optional[str] = None
    applied_date: Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name: str
    email: str
    education: Optional[str] = ""
    skills: List[str] = []
    experience: Optional[str] = ""
    preferred_role: Optional[str] = ""
    preferred_location: Optional[str] = ""
    resume_name: Optional[str] = None
    resume_data: Optional[str] = None

class ApiKeyUpdate(BaseModel):
    api_key: str

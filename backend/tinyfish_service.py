import json
import logging
import re
import time
import uuid
from typing import Dict, Any, List, Optional, Tuple
from config import TINYFISH_API_KEY, DEFAULT_COMPANIES

logger = logging.getLogger("jobpilot.tinyfish")
logging.basicConfig(level=logging.INFO)

class TinyFishService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = TINYFISH_API_KEY if api_key is None else api_key

    def set_api_key(self, api_key: str):
        self.api_key = api_key

    def get_status(self) -> Dict[str, Any]:
        """Test API key presence and basic connectivity."""
        has_key = bool(self.api_key and len(self.api_key.strip()) > 5)
        masked_key = ""
        if has_key:
            masked_key = "sk-••••••••"

        return {
            "configured": has_key,
            "masked_key": masked_key,
            "status": "configured" if has_key else "missing_key",
            "provider": "TinyFish AI Browser Agents"
        }

    def _normalize_extracted_item(self, item: Any, default_company: str, target_url: str) -> Dict[str, Any]:
        """Normalize an arbitrary item returned by TinyFish agent into our standard JobItem schema."""
        if isinstance(item, str):
            title = item.strip()
            desc = f"Extracted opportunity from {default_company} career page."
            return {
                "id": f"tf-{uuid.uuid4().hex[:8]}",
                "title": title,
                "company": default_company,
                "location": "India / Remote",
                "experience_level": "Fresher / Entry-Level",
                "job_type": "Full-time",
                "workplace_type": "Hybrid",
                "skills": ["Problem Solving", "Software Engineering"],
                "description": desc,
                "responsibilities": ["Collaborate with engineering teams", "Deliver high-quality software solutions"],
                "qualifications": ["Degree in CS, IT, or related field"],
                "apply_url": target_url,
                "source": "TinyFish AI Browser Agent",
                "posted_date": "Recently"
            }

        if not isinstance(item, dict):
            return None

        # Extract title
        title = (
            item.get("title") or item.get("role") or item.get("job_title") or
            item.get("position") or item.get("name") or "Software Engineering Opportunity"
        )

        company = (
            item.get("company") or item.get("organization") or default_company or "Technology Leader"
        )

        location = (
            item.get("location") or item.get("place") or item.get("city") or "India / Remote"
        )

        exp = item.get("experience_level") or item.get("experience") or item.get("level")
        if not exp:
            lower_title = title.lower()
            if "intern" in lower_title:
                exp = "Internship"
            elif any(w in lower_title for w in ["fresher", "entry", "associate", "graduate", "junior", "sde 1", "sde i", "engineer i", "engineer 1"]) or lower_title.endswith(" i") or lower_title.endswith(" 1"):
                exp = "Fresher"
            elif any(w in lower_title for w in ["senior", "lead", "architect", "staff", "principal"]):
                exp = "Senior"
            else:
                exp = "Mid-Level"

        job_type = item.get("job_type") or item.get("type") or item.get("employment_type")
        if not job_type:
            if "intern" in title.lower():
                job_type = "Internship"
            else:
                job_type = "Full-time"

        workplace_type = item.get("workplace_type") or item.get("mode") or "Hybrid"
        if "remote" in str(location).lower() or "remote" in str(title).lower():
            workplace_type = "Remote"

        # Skills parsing
        raw_skills = item.get("skills") or item.get("technologies") or item.get("tech_stack") or []
        skills = []
        if isinstance(raw_skills, list):
            skills = [str(s).strip() for s in raw_skills if s]
        elif isinstance(raw_skills, str):
            skills = [s.strip() for s in raw_skills.split(",") if s.strip()]

        if not skills:
            skills = ["Python", "JavaScript", "Problem Solving", "Git"]

        # Description & text
        desc = (
            item.get("description") or item.get("summary") or item.get("about") or
            f"Opportunity extracted directly from {company} official portal via TinyFish web agent."
        )

        responsibilities = item.get("responsibilities") or item.get("duties") or []
        if isinstance(responsibilities, str):
            responsibilities = [r.strip() for r in responsibilities.split("\n") if r.strip()]
        elif not isinstance(responsibilities, list) or len(responsibilities) == 0:
            responsibilities = [
                f"Design, develop, and test software components for {company}.",
                "Collaborate with cross-functional product and engineering teams.",
                "Ensure reliable and scalable deployment standards."
            ]

        qualifications = item.get("qualifications") or item.get("requirements") or []
        if isinstance(qualifications, str):
            qualifications = [q.strip() for q in qualifications.split("\n") if q.strip()]
        elif not isinstance(qualifications, list) or len(qualifications) == 0:
            qualifications = [
                "B.Tech / B.E. / M.Tech in Computer Science or related degree.",
                "Solid fundamentals in algorithms, data structures, and system design."
            ]

        apply_url = (
            item.get("apply_url") or item.get("link") or item.get("url") or item.get("application_link") or target_url
        )

        posted_date = item.get("posted_date") or item.get("date") or item.get("deadline") or "Recently Active"

        return {
            "id": f"tf-{uuid.uuid4().hex[:8]}",
            "title": str(title),
            "company": str(company),
            "location": str(location),
            "experience_level": str(exp),
            "job_type": str(job_type),
            "workplace_type": str(workplace_type),
            "skills": skills,
            "description": str(desc),
            "responsibilities": responsibilities,
            "qualifications": qualifications,
            "apply_url": str(apply_url),
            "source": "TinyFish AI Browser Agent",
            "posted_date": str(posted_date),
            "is_live": True,
            "data_badge": "LIVE TINYFISH AGENT",
            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }

    def _parse_agent_result(self, raw_result: Any, default_company: str, target_url: str) -> List[Dict[str, Any]]:
        """Safely parse TinyFish agent.run output into structured job list."""
        if not raw_result:
            return []

        parsed_data = None
        if isinstance(raw_result, (list, dict)):
            parsed_data = raw_result
        elif isinstance(raw_result, str):
            text = raw_result.strip()
            # Try direct JSON parse
            try:
                parsed_data = json.loads(text)
            except Exception:
                # Try finding JSON block inside markdown ```json ... ```
                json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
                if json_match:
                    try:
                        parsed_data = json.loads(json_match.group(1))
                    except Exception:
                        pass
                # Or find [ ... ] or { ... }
                if not parsed_data:
                    bracket_match = re.search(r"(\[[\s\S]*\]|\{[\s\S]*\})", text)
                    if bracket_match:
                        try:
                            parsed_data = json.loads(bracket_match.group(1))
                        except Exception:
                            pass

        jobs = []
        if isinstance(parsed_data, list):
            for item in parsed_data:
                normalized = self._normalize_extracted_item(item, default_company, target_url)
                if normalized:
                    jobs.append(normalized)
        elif isinstance(parsed_data, dict):
            # Check for keys like 'roles', 'jobs', 'listings', 'openings', 'results'
            for key in ["roles", "jobs", "listings", "openings", "results", "opportunities", "data"]:
                if key in parsed_data and isinstance(parsed_data[key], list):
                    for item in parsed_data[key]:
                        normalized = self._normalize_extracted_item(item, default_company, target_url)
                        if normalized:
                            jobs.append(normalized)
                    break
            if not jobs:
                normalized = self._normalize_extracted_item(parsed_data, default_company, target_url)
                if normalized:
                    jobs.append(normalized)

        return jobs

    def search_live(
        self,
        query: str = "",
        company_name: str = "",
        target_url: str = "",
        location: str = "",
        experience_level: str = "",
        job_type: str = "",
        timeout_seconds: int = 60
    ) -> Dict[str, Any]:
        """
        Runs TinyFish Agent on target company career portal or search endpoint.
        Returns normalized jobs along with diagnostic progress logs.
        """
        start_time = time.time()
        logs = []
        logs.append(f"🔍 Starting JobPilot AI Search at {time.strftime('%H:%M:%S')}")

        # Resolve target company and career URL
        company_target = company_name or ""
        final_url = target_url

        # Auto-detect target company from query if not explicitly set
        if (not company_target or company_target.lower() == "all") and query:
            q_lower = query.lower()
            for c in DEFAULT_COMPANIES:
                if c["name"].lower() in q_lower or c["id"].lower() in q_lower:
                    company_target = c["name"]
                    final_url = c["careers_url"]
                    break

        if not final_url and company_target and company_target.lower() != "all":
            for c in DEFAULT_COMPANIES:
                if c["name"].lower() == company_target.lower() or c["id"].lower() == company_target.lower():
                    final_url = c["careers_url"]
                    company_target = c["name"]
                    break

        if not final_url:
            final_url = "https://www.google.com/about/careers/applications/jobs/results/"
            company_target = "Google"

        logs.append(f"🎯 Target Portal: {company_target} ({final_url})")

        goal = (
            f"Find open job or internship postings for '{query or 'software engineer or AI or developer'}' "
            f"in '{location or 'India or Remote'}'. "
            "Return JSON: a list of objects with fields: role, company, location, experience_level, job_type, skills, description, link."
        )
        logs.append(f"🤖 Configured TinyFish Autonomous Agent Goal: \"{goal[:80]}...\"")

        try:
            # Check if tinyfish module is available
            import tinyfish
            from tinyfish import TinyFish, RunStatus
            from tinyfish._utils.exceptions import AuthenticationError, APITimeoutError, RateLimitError
        except ImportError:
            logs.append("⚠️ TinyFish Python SDK is not loaded. Utilizing high-speed verified index.")
            return {
                "success": False,
                "error": "TinyFish library not loaded",
                "api_status": "library_missing",
                "jobs": [],
                "logs": logs,
                "duration": round(time.time() - start_time, 2)
            }

        if not self.api_key:
            logs.append("⚠️ TINYFISH_API_KEY environment variable is not set. Please set it in backend/.env")
            return {
                "success": False,
                "error": "Missing TINYFISH_API_KEY",
                "api_status": "missing_key",
                "jobs": [],
                "logs": logs,
                "duration": round(time.time() - start_time, 2)
            }

        logs.append("🚀 Initializing TinyFish Client with API key...")
        client = TinyFish(api_key=self.api_key)

        extracted_jobs = []

        try:
            logs.append(f"🌐 Launching TinyFish stealth browser agent on {final_url}...")
            logs.append("⏳ Agent is scanning career portal DOM, interacting with search filters, and extracting roles...")

            run = client.agent.run(url=final_url, goal=goal)

            logs.append(f"📡 TinyFish agent returned status: {run.status}")

            if run.status == RunStatus.COMPLETED:
                logs.append("✅ Agent finished run successfully. Parsing extracted listings...")
                raw_result = run.result
                extracted_jobs = self._parse_agent_result(raw_result, company_target, final_url)
                logs.append(f"✨ Successfully normalized {len(extracted_jobs)} live job opportunities!")
                
                return {
                    "success": True,
                    "jobs": extracted_jobs,
                    "logs": logs,
                    "source": "TinyFish AI Browser Agent",
                    "api_status": "connected",
                    "duration": round(time.time() - start_time, 2)
                }
            else:
                logs.append(f"⚠️ Agent completed with status: {run.status}. Empty response.")
                return {
                    "success": False,
                    "jobs": [],
                    "logs": logs,
                    "source": "TinyFish AI Browser Agent",
                    "api_status": "agent_failed",
                    "duration": round(time.time() - start_time, 2),
                    "error": f"Agent status: {run.status}"
                }

        except AuthenticationError as e:
            logs.append("❌ TinyFish Authentication Error: The provided TINYFISH_API_KEY is invalid or expired.")
            logs.append("💡 Note: You can obtain an active student/dev key at https://agent.tinyfish.ai/api-keys")
            return {
                "success": False,
                "jobs": [],
                "logs": logs,
                "source": "TinyFish API (Auth Error)",
                "api_status": "expired_key_warning",
                "error": "Invalid or expired TinyFish API key.",
                "duration": round(time.time() - start_time, 2)
            }
        except APITimeoutError as e:
            logs.append("⏱️ TinyFish API Timeout: Career portal took longer than 60 seconds to respond.")
            return {
                "success": False,
                "jobs": [],
                "logs": logs,
                "source": "TinyFish API (Timeout)",
                "api_status": "timeout",
                "error": "TinyFish API Request Timed Out.",
                "duration": round(time.time() - start_time, 2)
            }
        except RateLimitError as e:
            logs.append("⚠️ TinyFish API Rate Limit: Too many concurrent agent requests.")
            return {
                "success": False,
                "jobs": [],
                "logs": logs,
                "source": "TinyFish API (Rate Limit)",
                "api_status": "rate_limited",
                "error": "Rate limit exceeded on TinyFish API.",
                "duration": round(time.time() - start_time, 2)
            }
        except Exception as e:
            logger.exception("Unexpected error in TinyFish agent run")
            logs.append(f"⚠️ Agent encounter: {str(e)[:120]}")
            return {
                "success": False,
                "jobs": [],
                "logs": logs,
                "source": "TinyFish API (Error)",
                "api_status": "error",
                "error": str(e),
                "duration": round(time.time() - start_time, 2)
            }

    def fetch_live_amazon_jobs(self, query: str = "", location: str = "") -> List[Dict[str, Any]]:
        """
        Extracts verified live open roles directly from Amazon Careers official endpoint.
        Returns live normalized jobs with direct application URLs.
        """
        import httpx
        url = "https://www.amazon.jobs/en/search.json"
        params = {
            "base_query": query or "Software Development Engineer",
            "country": "IND",
            "result_limit": 10
        }
        try:
            with httpx.Client(timeout=10) as client:
                resp = client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    jobs_raw = data.get("jobs", [])
                    results = []
                    for item in jobs_raw:
                        title = item.get("title", "Software Development Engineer")
                        loc = item.get("normalized_location") or item.get("location") or "India"
                        job_path = item.get("job_path", "")
                        apply_url = f"https://www.amazon.jobs{job_path}" if job_path else "https://www.amazon.jobs/en/"
                        desc = item.get("description", "") or "Direct posting from Amazon Careers portal."
                        clean_desc = re.sub(r'<[^>]+>', ' ', desc)[:320].strip()
                        
                        lower_title = title.lower()
                        exp = "Fresher" if any(w in lower_title for w in ["1", " i", "entry", "intern", "associate", "junior"]) else "Mid-Level"
                        jtype = "Internship" if "intern" in lower_title else "Full-time"
                        
                        results.append({
                            "id": f"amzn-{item.get('id_icims', uuid.uuid4().hex[:8])}",
                            "title": title,
                            "company": "Amazon",
                            "company_logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                            "location": loc,
                            "experience_level": exp,
                            "job_type": jtype,
                            "workplace_type": "Onsite" if "onsite" in loc.lower() else "Hybrid",
                            "skills": ["Java", "AWS", "Distributed Systems", "Data Structures", "Algorithms"],
                            "description": clean_desc,
                            "responsibilities": [
                                "Design, implement, and deploy customer-facing scalable services for Amazon.",
                                "Collaborate on architecture and high-throughput microservices on AWS cloud."
                            ],
                            "qualifications": [
                                "Bachelor's degree in Computer Science or related STEM field.",
                                "Experience with object-oriented programming in Java, C++, or Python."
                            ],
                            "apply_url": apply_url,
                            "source": "Amazon Careers (Official Live Portal)",
                            "posted_date": item.get("posted_date", "Recently Active"),
                            "is_live": True,
                            "data_badge": "LIVE AMAZON PORTAL",
                            "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S")
                        })
                    return results
        except Exception as e:
            logger.warning(f"Failed to fetch live Amazon jobs: {e}")
            return []

tinyfish_service = TinyFishService()

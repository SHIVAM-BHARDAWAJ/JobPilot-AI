import os
from pathlib import Path
from dotenv import load_dotenv

# Locate .env from backend folder or root
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
ROOT_ENV_PATH = BASE_DIR.parent / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
elif ROOT_ENV_PATH.exists():
    load_dotenv(dotenv_path=ROOT_ENV_PATH)
else:
    load_dotenv()

TINYFISH_API_KEY = os.getenv("TINYFISH_API_KEY", "")
DATABASE_PATH = BASE_DIR / "jobpilot.db"

# Pre-configured supported companies
DEFAULT_COMPANIES = [
    {
        "id": "google",
        "name": "Google",
        "category": "Big Tech / FAANG",
        "careers_url": "https://www.google.com/about/careers/applications/jobs/results/",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "color": "#4285F4",
        "hq": "Mountain View, CA & Bengaluru, India",
        "hiring_focus": "Software Engineer, AI/ML Researcher, Cloud Solutions, Product Specialist"
    },
    {
        "id": "microsoft",
        "name": "Microsoft",
        "category": "Enterprise & Cloud",
        "careers_url": "https://careers.microsoft.com/v2/global/en/home.html",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "color": "#00A4EF",
        "hq": "Redmond, WA & Hyderabad, India",
        "hiring_focus": "Full Stack Engineer, Azure DevOps, Data Scientist, Security Analyst"
    },
    {
        "id": "amazon",
        "name": "Amazon",
        "category": "E-Commerce & AWS",
        "careers_url": "https://www.amazon.jobs/en/",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "color": "#FF9900",
        "hq": "Seattle, WA & Hyderabad, India",
        "hiring_focus": "SDE I / II, Frontend Engineer, AWS Cloud Architect, Machine Learning"
    },
    {
        "id": "adobe",
        "name": "Adobe",
        "category": "Creative & Digital Media",
        "careers_url": "https://careers.adobe.com/us/en",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Corporate_Horizontal_Red_HEX.svg",
        "color": "#FF0000",
        "hq": "San Jose, CA & Noida, India",
        "hiring_focus": "Computer Vision, Generative AI Engineer, Backend Java/Go, UI Designer"
    },
    {
        "id": "deloitte",
        "name": "Deloitte",
        "category": "Consulting & Advisory",
        "careers_url": "https://jobs2.deloitte.com/ui/en",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
        "color": "#86BC25",
        "hq": "New York, NY & Hyderabad, India",
        "hiring_focus": "Analyst, Cybersecurity, Cloud Transformation, Business Technology"
    },
    {
        "id": "flipkart",
        "name": "Flipkart",
        "category": "E-Commerce Unicorn",
        "careers_url": "https://www.flipkartcareers.com/",
        "logo": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
        "color": "#2874F0",
        "hq": "Bengaluru, India",
        "hiring_focus": "Software Development Engineer, Mobile App Engineer, Data Platform"
    },
    {
        "id": "infosys",
        "name": "Infosys",
        "category": "Global IT Services",
        "careers_url": "https://www.infosys.com/careers.html",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        "color": "#007CC3",
        "hq": "Bengaluru, India",
        "hiring_focus": "Specialist Programmer, Systems Engineer, Java Full Stack, Cloud Consultant"
    },
    {
        "id": "tcs",
        "name": "TCS (Tata Consultancy Services)",
        "category": "Global IT Services",
        "careers_url": "https://www.tcs.com/careers",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
        "color": "#1B365D",
        "hq": "Mumbai, India",
        "hiring_focus": "Digital Ninja, Python Developer, Data Analyst, Cloud DevOps"
    },
    {
        "id": "wipro",
        "name": "Wipro",
        "category": "Technology & Consulting",
        "careers_url": "https://careers.wipro.com/",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
        "color": "#4A148C",
        "hq": "Bengaluru, India",
        "hiring_focus": "Project Engineer, Full Stack React/Node, AI Developer, Test Automation"
    },
    {
        "id": "accenture",
        "name": "Accenture",
        "category": "Strategy & Consulting",
        "careers_url": "https://www.accenture.com/in-en/careers",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        "color": "#A100FF",
        "hq": "Dublin, Ireland & Pan-India",
        "hiring_focus": "Associate Software Engineer, Advanced App Engineering, SAP, Generative AI"
    }
]

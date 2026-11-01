import json
import uuid
from database import get_db

INITIAL_JOBS = [
    {
        "id": "job-goog-01",
        "title": "Software Engineering Intern - Summer 2026",
        "company": "Google",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "location": "Bengaluru, Karnataka, India / Hyderabad, India",
        "experience_level": "Internship",
        "job_type": "Internship",
        "workplace_type": "Hybrid",
        "skills": ["C++", "Java", "Python", "Data Structures", "Algorithms", "Distributed Systems"],
        "description": "Google software engineering interns develop next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our ambitions reach for the stars.",
        "responsibilities": [
            "Write product or system development code participating in design reviews and testing.",
            "Collaborate with senior software engineers on scalable infrastructure, Search, YouTube, or Cloud services.",
            "Analyze and optimize code for performance, scalability, and security."
        ],
        "qualifications": [
            "Currently enrolled in an Associate, Bachelor's, or Master's program in Computer Science or related technical field.",
            "Experience with software development using Python, C++, Java, or Go.",
            "Strong fundamentals in Data Structures and Algorithms."
        ],
        "apply_url": "https://www.google.com/about/careers/applications/jobs/results/",
        "source": "Google Careers Portal",
        "posted_date": "2 days ago"
    },
    {
        "id": "job-goog-02",
        "title": "Associate Cloud Engineer (Fresher / Campus Graduate)",
        "company": "Google",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "location": "Hyderabad, Telangana, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["Google Cloud Platform", "Kubernetes", "Linux", "Python", "Terraform", "Networking"],
        "description": "As an Associate Cloud Engineer at Google, you will help customers migrate, design, and modernize enterprise systems on Google Cloud Platform, building reliable infrastructure with high availability.",
        "responsibilities": [
            "Deploy and configure cloud computing solutions on GCP.",
            "Work with clients to design robust CI/CD and Kubernetes environments.",
            "Troubleshoot operational and infrastructure challenges in large-scale deployments."
        ],
        "qualifications": [
            "Bachelor's degree in Computer Science, Information Technology, or equivalent practical experience.",
            "Familiarity with cloud concepts, Linux OS internals, and scripting.",
            "Excellent communication and problem-solving abilities."
        ],
        "apply_url": "https://www.google.com/about/careers/applications/jobs/results/",
        "source": "Google Careers Portal",
        "posted_date": "1 day ago"
    },
    {
        "id": "job-msft-01",
        "title": "Software Development Engineer - Full Stack (AI & Copilot)",
        "company": "Microsoft",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "location": "Bengaluru, Karnataka, India",
        "experience_level": "Mid-Level",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["React", "TypeScript", "C#", ".NET Core", "Azure OpenAI", "Microservices"],
        "description": "Join the Microsoft 365 and Copilot engineering team to build generative AI-driven collaborative experiences used by over 300 million active enterprise users worldwide.",
        "responsibilities": [
            "Design and build responsive frontend interfaces using React, TypeScript, and Fluent UI.",
            "Architect high-throughput backend APIs integrating LLM orchestration and vector search.",
            "Write comprehensive unit, integration, and performance automated tests."
        ],
        "qualifications": [
            "2-4 years of experience delivering commercial web applications at scale.",
            "Demonstrated proficiency in TypeScript/JavaScript and C# or Java.",
            "Experience working with RESTful APIs, GraphQL, and cloud services (Azure/AWS)."
        ],
        "apply_url": "https://careers.microsoft.com/v2/global/en/home.html",
        "source": "Microsoft Careers",
        "posted_date": "Just now"
    },
    {
        "id": "job-msft-02",
        "title": "Research Intern - Machine Learning & LLMs",
        "company": "Microsoft",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "location": "Bengaluru, Karnataka, India / Remote",
        "experience_level": "Internship",
        "job_type": "Internship",
        "workplace_type": "Remote",
        "skills": ["PyTorch", "Python", "Transformers", "NLP", "Model Quantization", "CUDA"],
        "description": "Microsoft Research India is seeking passionate research interns to explore frontiers in foundation models, multilingual NLP, agentic workflows, and efficient model inferencing.",
        "responsibilities": [
            "Formulate research hypotheses and design experiments on cutting-edge deep learning architectures.",
            "Train, evaluate, and benchmark language and multimodal models on GPU clusters.",
            "Write scientific papers and open-source contributions."
        ],
        "qualifications": [
            "Enrolled in Master's or PhD, or final year Bachelor's with published research.",
            "Hands-on experience with PyTorch, Hugging Face, or DeepSpeed.",
            "Solid math, probability, and linear algebra foundation."
        ],
        "apply_url": "https://careers.microsoft.com/v2/global/en/home.html",
        "source": "Microsoft Careers",
        "posted_date": "3 days ago"
    },
    {
        "id": "job-amzn-01",
        "title": "Software Development Engineer I (SDE 1)",
        "company": "Amazon",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "location": "Hyderabad, Telangana, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Onsite",
        "skills": ["Java", "AWS", "DynamoDB", "Object-Oriented Design", "Distributed Systems", "Git"],
        "description": "Amazon is looking for software engineers who crave opportunities to solve global scale problems. You will work on core retail, logistics, or AWS cloud systems handling millions of transactions every minute.",
        "responsibilities": [
            "Write maintainable, robust Java/Kotlin code following SOLID and clean architecture.",
            "Design low-latency schema models with DynamoDB and Amazon Aurora.",
            "Participate in 24/7 on-call rotations and operational metrics reviews."
        ],
        "qualifications": [
            "0-2 years of software engineering experience or recent graduate (2024-2025).",
            "Strong grasp of CS fundamentals: algorithms, OOP, database design, and concurrency.",
            "Familiarity with AWS services is a plus."
        ],
        "apply_url": "https://www.amazon.jobs/en/",
        "source": "Amazon Jobs",
        "posted_date": "Today"
    },
    {
        "id": "job-adbe-01",
        "title": "Computer Vision & Generative AI Intern",
        "company": "Adobe",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Corporate_Horizontal_Red_HEX.svg",
        "location": "Noida, Uttar Pradesh, India / Bengaluru, India",
        "experience_level": "Internship",
        "job_type": "Internship",
        "workplace_type": "Hybrid",
        "skills": ["Python", "Diffusion Models", "PyTorch", "C++", "OpenCV", "Image Processing"],
        "description": "At Adobe, you will work on the next generation of creative intelligence powering Adobe Firefly, Photoshop, and Premiere Pro, turning creative sparks into production-grade AI features.",
        "responsibilities": [
            "Research, prototype, and implement diffusion and generative media algorithms.",
            "Optimize neural network pipelines for high-resolution image synthesis.",
            "Partner with product teams to ship AI tools directly to millions of creators."
        ],
        "qualifications": [
            "B.Tech / M.Tech / MS student in Computer Science or Electrical Engineering.",
            "Proven project work or academic publication in generative media or computer vision.",
            "Deep proficiency in Python, PyTorch, and linear algebra."
        ],
        "apply_url": "https://careers.adobe.com/us/en",
        "source": "Adobe Careers",
        "posted_date": "Yesterday"
    },
    {
        "id": "job-flpk-01",
        "title": "UI Engineer - React & Web Performance",
        "company": "Flipkart",
        "company_logo": "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
        "location": "Bengaluru, Karnataka, India",
        "experience_level": "Mid-Level",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["React", "Next.js", "Redux", "Web Performance", "Tailwind CSS", "PWA"],
        "description": "Flipkart's consumer experience team is hiring UI engineers to optimize web shopping journeys for over 500 million registered Indian shoppers with sub-second page loads.",
        "responsibilities": [
            "Build silky smooth responsive UI components used during Big Billion Days.",
            "Improve Core Web Vitals (LCP, FID, CLS) across all mobile web viewports.",
            "Collaborate with UX designers to implement accessible, pixel-perfect layouts."
        ],
        "qualifications": [
            "2-5 years of hands-on frontend web development experience.",
            "Deep understanding of browser rendering pipelines, caching, and code splitting.",
            "Strong command of modern JavaScript (ES6+), React hooks, and state management."
        ],
        "apply_url": "https://www.flipkartcareers.com/",
        "source": "Flipkart Careers",
        "posted_date": "3 days ago"
    },
    {
        "id": "job-deli-01",
        "title": "Technology Analyst - Cyber & Cloud Security",
        "company": "Deloitte",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
        "location": "Hyderabad / Gurugram / Mumbai, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["Cybersecurity", "Python", "SIEM", "AWS Security", "Network Protocols", "Linux"],
        "description": "Deloitte US-India offices are hiring entry-level Technology Analysts to protect Fortune 500 enterprises against emerging cyber threats, ransomware, and cloud infrastructure vulnerabilities.",
        "responsibilities": [
            "Monitor enterprise security operations centers and perform incident triage.",
            "Assess client cloud configurations against NIST and ISO security standards.",
            "Automate security compliance scripts using Python and Bash."
        ],
        "qualifications": [
            "B.E. / B.Tech in CSE, IT, Cyber Security, or related disciplines.",
            "Understanding of TCP/IP, OSI model, firewalls, and encryption basics.",
            "Strong analytical mindset and client presentation skills."
        ],
        "apply_url": "https://jobs2.deloitte.com/ui/en",
        "source": "Deloitte Careers",
        "posted_date": "4 days ago"
    },
    {
        "id": "job-info-01",
        "title": "Specialist Programmer (AI & Full Stack)",
        "company": "Infosys",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        "location": "Bengaluru / Pune / Chennai, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["Java Spring Boot", "Python", "React", "Docker", "PostgreSQL", "REST APIs"],
        "description": "The Infosys Specialist Programmer track is a high-impact engineering role dedicated to solving complex algorithmic challenges and building top-tier digital transformation platforms.",
        "responsibilities": [
            "Design and build end-to-end full-stack applications with microservices.",
            "Implement high-performance REST APIs and integrate enterprise databases.",
            "Write automated unit tests and participate in agile sprints."
        ],
        "qualifications": [
            "B.E. / B.Tech / M.Tech in Computer Science or related fields.",
            "Excellent competitive programming or problem-solving rating (Hackerrank / LeetCode).",
            "Passion for building production code with modern tech stacks."
        ],
        "apply_url": "https://www.infosys.com/careers.html",
        "source": "Infosys Careers",
        "posted_date": "Today"
    },
    {
        "id": "job-tcs-01",
        "title": "TCS Digital - Associate Systems Engineer",
        "company": "TCS",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
        "location": "Mumbai / Bengaluru / Hyderabad / Delhi, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Onsite",
        "skills": ["Python", "Machine Learning", "SQL", "Cloud Basics", "Data Analytics"],
        "description": "TCS Digital is the premier innovation wing of Tata Consultancy Services, empowering young innovators to work on IoT, GenAI, Big Data, and Cloud solutions for global industry leaders.",
        "responsibilities": [
            "Develop data analytics pipelines and business intelligence dashboards.",
            "Train and deploy predictive machine learning models.",
            "Collaborate with international delivery teams across diverse domains."
        ],
        "qualifications": [
            "Graduates of 2025/2026 batches in Engineering or MCA.",
            "Good knowledge of programming in Python, Java, or C#.",
            "Strong logical reasoning and aptitude."
        ],
        "apply_url": "https://www.tcs.com/careers",
        "source": "TCS Careers",
        "posted_date": "5 days ago"
    },
    {
        "id": "job-wipro-01",
        "title": "Project Engineer - Cloud & React Native",
        "company": "Wipro",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
        "location": "Bengaluru / Hyderabad / Noida, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["React Native", "JavaScript", "Node.js", "MongoDB", "Git"],
        "description": "Work on enterprise mobility applications and cloud infrastructure with Wipro's NextGen Engineering unit. Build cross-platform iOS and Android apps for healthcare and banking clients.",
        "responsibilities": [
            "Develop modular React Native UI screens with smooth gestures and state caching.",
            "Integrate third-party RESTful APIs and push notification gateways.",
            "Maintain code hygiene and peer-review pull requests."
        ],
        "qualifications": [
            "Engineering graduate with passion for mobile and web development.",
            "Hands-on experience with JavaScript ES6+, React or React Native.",
            "Quick learner with good communication skills."
        ],
        "apply_url": "https://careers.wipro.com/",
        "source": "Wipro Careers",
        "posted_date": "1 week ago"
    },
    {
        "id": "job-acc-01",
        "title": "Associate Software Engineer - Generative AI & Automation",
        "company": "Accenture",
        "company_logo": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        "location": "Gurugram / Bengaluru / Pune, India",
        "experience_level": "Fresher",
        "job_type": "Full-time",
        "workplace_type": "Hybrid",
        "skills": ["Python", "LangChain", "OpenAI API", "SQL", "Azure Cloud", "Prompt Engineering"],
        "description": "Accenture's Advanced Technology Centers in India (ATCI) is hiring associate software engineers to build enterprise generative AI solutions, automated customer assistants, and data intelligence workflows.",
        "responsibilities": [
            "Implement RAG (Retrieval Augmented Generation) architectures using LangChain and vector databases.",
            "Construct robust prompt engineering pipelines with guardrails.",
            "Collaborate with client teams to deploy AI solutions on Microsoft Azure."
        ],
        "qualifications": [
            "B.E./B.Tech degree in any engineering stream.",
            "Demonstrated curiosity for Artificial Intelligence, Machine Learning, and software engineering.",
            "Strong verbal and written English communication skills."
        ],
        "apply_url": "https://www.accenture.com/in-en/careers",
        "source": "Accenture Careers",
        "posted_date": "2 days ago"
    }
]

def seed_jobs_if_empty():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM jobs")
    count = cursor.fetchone()["count"]

    if count == 0:
        for job in INITIAL_JOBS:
            cursor.execute("""
                INSERT OR IGNORE INTO jobs (
                    id, title, company, company_logo, location, experience_level,
                    job_type, workplace_type, skills, description, responsibilities,
                    qualifications, apply_url, source, posted_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                job["id"],
                job["title"],
                job["company"],
                job["company_logo"],
                job["location"],
                job["experience_level"],
                job["job_type"],
                job["workplace_type"],
                json.dumps(job["skills"]),
                job["description"],
                json.dumps(job["responsibilities"]),
                json.dumps(job["qualifications"]),
                job["apply_url"],
                job["source"],
                job["posted_date"]
            ))

        # Also add sample application tracking records
        cursor.execute("""
            INSERT OR IGNORE INTO applications (
                id, job_id, company, job_title, location, apply_url, status, applied_date, notes, salary_range
            ) VALUES 
            ('app-1', 'job-goog-01', 'Google', 'Software Engineering Intern - Summer 2026', 'Bengaluru, India', 'https://www.google.com/about/careers/applications/jobs/results/', 'Applied', '2026-10-28', 'Referral submitted by senior alumni. Technical screening next week.', '₹1,20,000 / month stipend'),
            ('app-2', 'job-msft-01', 'Microsoft', 'Software Development Engineer - Full Stack (AI & Copilot)', 'Bengaluru, India', 'https://careers.microsoft.com/v2/global/en/home.html', 'Interview', '2026-10-25', 'Cleared Round 1 System Design. Final behavioral + hiring manager round scheduled for Friday.', '₹24,00,000 - ₹28,00,000 / year'),
            ('app-3', 'job-adbe-01', 'Adobe', 'Computer Vision & Generative AI Intern', 'Noida, India', 'https://careers.adobe.com/us/en', 'Assessment', '2026-10-30', 'HackerRank coding challenge completed (100% test cases passed). Awaiting result.', '₹1,00,000 / month stipend'),
            ('app-4', 'job-amzn-01', 'Amazon', 'Software Development Engineer I (SDE 1)', 'Hyderabad, India', 'https://www.amazon.jobs/en/', 'Saved', '2026-10-31', 'Need to customize resume for AWS and distributed systems keywords.', '₹22,00,000 - ₹26,00,000 / year')
        """)

        # Add sample saved jobs
        cursor.execute("""
            INSERT OR IGNORE INTO saved_jobs (id, job_id, user_id)
            VALUES 
            ('save-1', 'job-goog-01', 'default_user'),
            ('save-2', 'job-msft-01', 'default_user')
        """)

        conn.commit()

    conn.close()

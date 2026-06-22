def generate_documents(company, job_title):

    cover_letter = f"""
Dear Hiring Manager,

I am excited to apply for the {job_title} position at {company}.
My experience with AWS, Docker, Kubernetes, Terraform and CI/CD
makes me a strong candidate.

Thank you for your consideration.

Regards
"""

    hr_email = f"""
Subject: Application for {job_title}

Dear HR Team,

Please find my resume attached for the {job_title} role at {company}.

Thank you.
"""

    linkedin_message = f"""
Hello,

I am interested in the {job_title} role at {company}.
I would love to connect and learn more.

Thank you.
"""

    referral_message = f"""
Hi,

I noticed an opening for {job_title} at {company}.
Would you be willing to refer me?

Thank you.
"""

    return {
        "cover_letter": cover_letter,
        "hr_email": hr_email,
        "linkedin_message": linkedin_message,
        "referral_message": referral_message
    }

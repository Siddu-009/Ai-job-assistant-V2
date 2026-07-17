def generate_cover_letter(name, job):

    return f"""
Dear Hiring Manager,

I am excited to apply for the position of {job.get("title")} at {job.get("company")}.

My background in cloud technologies, Linux, AWS, Docker, Kubernetes, Terraform and DevOps aligns well with the requirements of this role.

I enjoy building scalable infrastructure, CI/CD pipelines and automation solutions.

I look forward to contributing to your organization.

Sincerely,

{name}
"""
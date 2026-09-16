class CompanyProvider(BaseProvider):
    async def fetch_jobs(self, session, company):
        raise NotImplementedError

    async def search(self, keyword="", location="", **kwargs):
        jobs = []

        for company in self.companies:
            try:
                company_jobs = await self.fetch_jobs(session, company)
                jobs.extend(company_jobs)
            except Exception:
                continue

        return jobs
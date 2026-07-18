import Layout from "../components/Layout";
import SavedJobs from "../components/SavedJobs";

export default function SavedJobsPage() {
  return (
    <Layout
      title="Saved Jobs"
      subtitle="Manage all your saved jobs"
    >
      <SavedJobs />
    </Layout>
  );
}
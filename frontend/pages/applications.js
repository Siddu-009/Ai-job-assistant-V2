import Layout from "../components/Layout";
import Applications from "../components/Applications";

export default function ApplicationsPage() {
  return (
    <Layout
      title="Applications"
      subtitle="Manage and track your job applications"
    >
      <Applications />
    </Layout>
  );
}
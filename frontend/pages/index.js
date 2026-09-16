import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout dashboard={false}>
      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>AI Job Assistant</h1>

        <p>
          Hello World
        </p>
      </div>
    </Layout>
  );
}
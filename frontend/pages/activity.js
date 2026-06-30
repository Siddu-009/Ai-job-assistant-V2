import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function ActivityTimeline() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const resumeId = 3;

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {

    try {

      const response = await fetch(
        `/api/activity/${resumeId}`
      );

      const data = await response.json();

      setActivities(
        Array.isArray(data)
          ? data
          : []
      );

    }

    catch (err) {

      console.error(err);

      alert("Unable to load activity.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <Layout>

      <div
        style={{
          padding: "30px"
        }}
      >

        <h1>Activity Timeline</h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px"
          }}
        >
          Your recent resume activities.
        </p>

        {loading && <p>Loading...</p>}

        {!loading && activities.length === 0 && (
          <p>No activities found.</p>
        )}
              <div
          style={{
            marginTop: "30px"
          }}
        >
          {activities.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "25px"
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  marginTop: "8px",
                  flexShrink: 0
                }}
              />

              <div
                style={{
                  flex: 1,
                  borderLeft: "3px solid #2563eb",
                  paddingLeft: "20px",
                  paddingBottom: "20px"
                }}
              >
                <h3
                  style={{
                    marginTop: 0
                  }}
                >
                  {item.activity_type}
                </h3>

                <p>
                  {item.details}
                </p>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "14px"
                  }}
                >
                  {item.created_at}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </Layout>

  );

}

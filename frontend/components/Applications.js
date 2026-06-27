import { useState } from "react";

import Button from "./ui/Button";
import Loader from "./ui/Loader";

export default function Applications() {

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(false);

  const loadApplications = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/applications/my-applications",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token

          })

        }

      );

      const data = await response.json();

      setApplications(data || []);

    }

    catch (error) {

      console.error(error);

      alert("Unable to load applications.");

    }

    finally {

      setLoading(false);

    }

  };

  const getStatusColor = (status) => {

    switch ((status || "").toLowerCase()) {

      case "selected":

        return "#16a34a";

      case "rejected":

        return "#dc2626";

      case "interview":

        return "#2563eb";

      case "pending":

        return "#f59e0b";

      default:

        return "#6b7280";

    }

  };

  return (

    <div

      style={{

        marginTop: "30px",

        background: "#ffffff",

        borderRadius: "18px",

        padding: "30px",

        boxShadow: "0 10px 30px rgba(0,0,0,.08)"

      }}

    >

      <h2

        style={{

          marginTop: 0

        }}

      >

        My Applications

      </h2>

      <p

        style={{

          color: "#6b7280"

        }}

      >

        Track all jobs you have applied for.

      </p>

      <div

        style={{

          marginTop: "20px"

        }}

      >

        <Button

          onClick={loadApplications}

        >

          Load Applications

        </Button>

      </div>

	        {

        loading && (

          <Loader

            text="Loading Applications..."

          />

        )

      }

      {

        !loading && applications.length === 0 && (

          <div

            style={{

              marginTop: "25px",

              padding: "25px",

              background: "#f8fafc",

              borderRadius: "12px",

              textAlign: "center",

              color: "#6b7280"

            }}

          >

            No applications found.

          </div>

        )

      }

      {

        applications.map((app, index) => (

          <div

            key={index}

            style={{

              marginTop: "25px",

              border: "1px solid #e5e7eb",

              borderRadius: "16px",

              padding: "20px",

              background: "#ffffff",

              boxShadow: "0 5px 15px rgba(0,0,0,.05)"

            }}

          >

            <div

              style={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: "15px"

              }}

            >

              <div>

                <h3

                  style={{

                    margin: 0

                  }}

                >

                  {app.title}

                </h3>

                <p

                  style={{

                    marginTop: "8px",

                    color: "#6b7280"

                  }}

                >

                  {app.company}

                </p>

              </div>

              <div

                style={{

                  background: getStatusColor(app.status),

                  color: "#ffffff",

                  padding: "8px 16px",

                  borderRadius: "20px",

                  fontWeight: "600",

                  textTransform: "capitalize"

                }}

              >

                {app.status || "Pending"}

              </div>

            </div>

            <div

              style={{

                display: "flex",

                flexWrap: "wrap",

                gap: "12px",

                marginTop: "18px"

              }}

            >

              <span

                style={{

                  background: "#f3f4f6",

                  padding: "8px 14px",

                  borderRadius: "20px",

                  fontSize: "14px"

                }}

              >

                📅 Applied:

                {" "}

                {app.created_at || "N/A"}

              </span>

            </div>

            <div

              style={{

                marginTop: "20px"

              }}

            >
		              <p
                style={{
                  color: getStatusColor(app.status),
                  fontWeight: "600",
                  marginBottom: "20px"
                }}
              >
                {
                  app.status?.toLowerCase() === "selected"
                    ? "🎉 Congratulations! You have been selected."
                    : app.status?.toLowerCase() === "interview"
                    ? "📅 Interview scheduled. Prepare well!"
                    : app.status?.toLowerCase() === "rejected"
                    ? "❌ Application was not selected."
                    : "⏳ Your application is under review."
                }
              </p>

            </div>

          </div>

        ))

      }

      <div

        style={{

          marginTop: "30px",

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "15px"

        }}

      >

        <Button

          variant="secondary"

          onClick={loadApplications}

        >

          Refresh Applications

        </Button>

      </div>

      {

        !loading && applications.length > 0 && (

          <div

            style={{

              marginTop: "30px",

              padding: "20px",

              background: "#f8fafc",

              borderRadius: "12px",

              border: "1px solid #e5e7eb"

            }}

          >

            <h3

              style={{

                marginTop: 0,

                color: "#2563eb"

              }}

            >

              💡 Application Tips

            </h3>

            <ul

              style={{

                margin: 0,

                paddingLeft: "20px",

                lineHeight: "1.9",

                color: "#4b5563"

              }}

            >

              <li>

                Check your application status regularly.

              </li>

              <li>

                Prepare for interviews after receiving updates.

              </li>

              <li>

                Keep your resume updated for future applications.

              </li>

              <li>

                Follow up professionally if required.

              </li>

              <li>

                Continue applying while waiting for responses.

              </li>

            </ul>

          </div>

        )

      }

    </div>

  );

}

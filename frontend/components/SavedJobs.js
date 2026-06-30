import { useState } from "react";

import Button from "./ui/Button";
import Loader from "./ui/Loader";

export default function SavedJobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);

  const loadSavedJobs = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      if (!token) {

 	  window.location.href = "/login";

	  return;

      }

      const response = await fetch(

        `/api/saved-jobs/${token}`

      );

      const data = await response.json();

      if (!response.ok) {

	  console.error(data);

	  setJobs([]);

	  return;

      }

      setJobs(data);

    }

    catch(error){

      console.error(error);

      alert("Unable to load saved jobs.");

    }

    finally{

      setLoading(false);

    }

  };

  const deleteJob = async (savedId) => {

    try{

      await fetch(

        `/api/saved-jobs/${savedId}`,

        {

          method:"DELETE"

        }

      );

      loadSavedJobs();

    }

    catch(error){

      console.error(error);

      alert("Unable to remove saved job.");

    }

  };

  return(

    <div

      style={{

        marginTop:"30px",

        background:"#ffffff",

        borderRadius:"18px",

        padding:"30px",

        boxShadow:"0 10px 30px rgba(0,0,0,.08)"

      }}

    >

      <h2

        style={{

          marginTop:0

        }}

      >

        Saved Jobs

      </h2>

      <p

        style={{

          color:"#6b7280"

        }}

      >

        Manage all jobs you saved for future applications.

      </p>

      <div

        style={{

          marginTop:"20px"

        }}

      >

        <Button

          onClick={loadSavedJobs}

        >

          Load Saved Jobs

        </Button>

      </div>

	        {

        loading && (

          <Loader

            text="Loading Saved Jobs..."

          />

        )

      }

      {

        !loading && jobs.length === 0 && (

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

            No saved jobs available.

          </div>

        )

      }

      {

        jobs.map((job) => (

          <div

            key={job.saved_id}

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

                  {job.title}

                </h3>

                <p

                  style={{

                    marginTop: "8px",

                    color: "#6b7280"

                  }}

                >

                  {job.company}

                </p>

              </div>

              <div

                style={{

                  background: "#dcfce7",

                  color: "#166534",

                  padding: "8px 14px",

                  borderRadius: "20px",

                  fontWeight: "600"

                }}

              >

                Saved

              </div>

            </div>

            <div

              style={{

                display: "flex",

                gap: "12px",

                flexWrap: "wrap",

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

                📍 {job.location || "Location Not Available"}

              </span>

            </div>

            {

              job.apply_url && (

                <div

                  style={{

                    marginTop: "18px"

                  }}

                >

                  <a

                    href={job.apply_url}

                    target="_blank"

                    rel="noopener noreferrer"

                    style={{

                      color: "#2563eb",

                      textDecoration: "none",

                      fontWeight: "600"

                    }}

                  >

                    🔗 Apply on Company Website

                  </a>

                </div>

              )

            }

            <div

              style={{

                display: "flex",

                gap: "12px",

                flexWrap: "wrap",

                marginTop: "20px"

              }}

            >
		              <Button

                variant="danger"

                onClick={() =>

                  deleteJob(

                    job.saved_id

                  )

                }

              >

                Remove Job

              </Button>

              {

                job.apply_url && (

                  <Button

                    variant="primary"

                    onClick={() =>

                      window.open(

                        job.apply_url,

                        "_blank"

                      )

                    }

                  >

                    Apply Now

                  </Button>

                )

              }

            </div>

          </div>

        ))

      }

      {

        !loading && jobs.length > 0 && (

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

              💡 Saved Jobs Tips

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

                Review your saved jobs every day.

              </li>

              <li>

                Apply before the application deadline.

              </li>

              <li>

                Tailor your resume for each company.

              </li>

              <li>

                Keep your LinkedIn profile updated.

              </li>

              <li>

                Remove jobs that are no longer relevant.

              </li>

            </ul>

          </div>

        )

      }

    </div>

  );

}

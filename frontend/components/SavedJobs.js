import { useState } from "react";

import Button from "./ui/Button";
import Loader from "./ui/Loader";
import { useTheme } from "../context/ThemeContext";

export default function SavedJobs() {

  const { colors } = useTheme();

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

      const token = localStorage.getItem("token");

      await fetch(
        `/api/saved-jobs/${savedId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: token
          })
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

        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,

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

          color: colors.subText

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

              background: colors.surface,
              border: colors.borderStyle,

              borderRadius: "12px",

              textAlign: "center",

              color: colors.subText

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

              border: colors.borderStyle,

              borderRadius: "16px",

              padding: "20px",

              background: colors.card,
              color: colors.text,

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

                    color: colors.subText

                  }}

                >

                  {job.company}

                </p>

              </div>

              <div

                style={{

                  background: colors.successBg,

                  color: colors.successText,

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

                  background: colors.surface,
                  color: colors.text,
                  border: colors.borderStyle,

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

                      color: colors.text,

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

              background: colors.surface,
              border: colors.borderStyle,

              borderRadius: "12px",

            }}

          >

            <h3

              style={{

                marginTop: 0,

                color: colors.text

              }}

            >

              💡 Saved Jobs Tips

            </h3>

            <ul

              style={{

                margin: 0,

                paddingLeft: "20px",

                lineHeight: "1.9",

                color: colors.subText

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

import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Loader from "../components/ui/Loader";

const colors = {
    card: "#ffffff",
    background: "#f5f7fb",
    text: "#111827",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    shadow: "0 10px 25px rgba(0,0,0,.06)"
};

export default function Analytics() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadAnalytics();

  }, []);

  const loadAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/analytics-dashboard/",

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

      const result = await response.json();

      setData(result);

    }

    catch (error) {

      console.error(error);

      alert("Unable to load analytics.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

<Layout>

<div

style={{

padding:"30px",

background:"#f5f7fb",

minHeight:"100vh"

}}

>

<h1

style={{

marginBottom:"10px"

}}

>

Analytics Dashboard

</h1>

<p

style={{

color:"#6b7280",

marginBottom:"30px"

}}

>

Track your resume performance and job search analytics.

</p>

	      {

        loading && (

          <Loader

            text="Loading Analytics Dashboard..."

          />

        )

      }

      {

        data && (

          <>

            <div

              style={{

                display: "grid",

                gridTemplateColumns:

                  "repeat(auto-fit,minmax(220px,1fr))",

                gap: "20px",

                marginBottom: "30px"

              }}

            >

              <Card

                title="Uploaded Resumes"

                value={

                  data.uploaded_resumes || 0

                }

                color="#2563eb"

              />

              <Card

                title="Generated Resumes"

                value={

                  data.generated_resumes || 0

                }

                color="#16a34a"

              />

              <Card

                title="Saved Jobs"

                value={

                  data.saved_jobs || 0

                }

                color="#f59e0b"

              />

              <Card

                title="Applications"

                value={

                  data.applications || 0

                }

                color="#7c3aed"

              />

            </div>

            <div

              style={{

                display: "grid",

                gridTemplateColumns:

                  "2fr 1fr",

                gap: "25px",

                marginBottom: "30px"

              }}

            >

              <div

                style={{

                  background: "#ffffff",

                  borderRadius: "18px",

                  padding: "25px",

                  boxShadow:

                    "0 10px 25px rgba(0,0,0,.06)"

                }}

              >

                <h2>

                  Weekly Performance

                </h2>

                <div

                  style={{

                    marginTop: "25px"

                  }}

                >

                  {

                    [

                      {

                        name: "Resume Uploads",

                        value:

                          data.uploaded_resumes || 0,

                        color: "#2563eb"

                      },

                      {

                        name: "Generated Resumes",

                        value:

                          data.generated_resumes || 0,

                        color: "#16a34a"

                      },

                      {

                        name: "Applications",

                        value:

                          data.applications || 0,

                        color: "#7c3aed"

                      },

                      {

                        name: "Saved Jobs",

                        value:

                          data.saved_jobs || 0,

                        color: "#f59e0b"

                      }

                    ].map((item, index) => (

                      <div

                        key={index}

                        style={{

                          marginBottom: "20px"

                        }}

                      >

                        <div

                          style={{

                            display: "flex",

                            justifyContent:

                              "space-between",

                            marginBottom: "8px"

                          }}

                        >

                          <span>

                            {item.name}

                          </span>

                          <strong>

                            {item.value}

                          </strong>

                        </div>

                        <div

                          style={{

                            height: "10px",

                            background: "#e5e7eb",

                            borderRadius: "20px"

                          }}

                        >

                          <div

                            style={{

                              width: `${Math.min(
                                item.value * 10,
                                100
                              )}%`,

                              height: "100%",

                              background:

                                item.color,

                              borderRadius:

                                "20px"

                            }}

                          />

                        </div>

                      </div>

                    ))

                  }

                </div>

              </div>

              <div

                style={{

                  background: "#ffffff",

                  borderRadius: "18px",

                  padding: "25px",

                  boxShadow:

                    "0 10px 25px rgba(0,0,0,.06)"

                }}

              >

                <h2>

                  Profile Score

                </h2>

                <h1

                  style={{

                    color: "#16a34a",

                    marginTop: "25px"

                  }}

                >

                  92%

                </h1>

                <div

                  style={{

                    height: "12px",

                    background: "#e5e7eb",

                    borderRadius: "20px",

                    marginTop: "15px"

                  }}

                >

                  <div

                    style={{

                      width: "92%",

                      height: "100%",

                      background: "#16a34a",

                      borderRadius: "20px"

                    }}

                  />

                </div>

                <p

                  style={{

                    marginTop: "15px",

                    color: "#6b7280"

                  }}

                >

                  Your profile is nearly complete.

                </p>

              </div>

            </div>

		            <div

              style={{

                display: "grid",

                gridTemplateColumns: "1fr 1fr",

                gap: "25px",

                marginBottom: "30px"

              }}

            >

              <div

                style={{

                  background: "#ffffff",

                  borderRadius: "18px",

                  padding: "25px",

                  boxShadow:

                    "0 10px 25px rgba(0,0,0,.06)"

                }}

              >

                <h2>

                  🤖 AI Insights

                </h2>

                <div

                  style={{

                    marginTop: "20px",

                    lineHeight: "2"

                  }}

                >

                  <p>

                    {data.insights ||

                      "No AI insights available."}

                  </p>

                  <ul

                    style={{

                      paddingLeft: "20px",

                      color: "#4b5563"

                    }}

                  >

                    <li>

                      Improve your ATS score above 90%.

                    </li>

                    <li>

                      Add Kubernetes & Terraform projects.

                    </li>

                    <li>

                      Continue applying to matching jobs.

                    </li>

                    <li>

                      Keep your resume updated weekly.

                    </li>

                  </ul>

                </div>

              </div>

              <div

                style={{

                  background: "#ffffff",

                  borderRadius: "18px",

                  padding: "25px",

                  boxShadow:

                    "0 10px 25px rgba(0,0,0,.06)"

                }}

              >

                <h2>

                  ATS Progress

                </h2>

                <div

                  style={{

                    marginTop: "25px"

                  }}

                >

                  {

                    [70,76,82,87,91].map(

                      (score,index)=>(

                        <div

                          key={index}

                          style={{

                            marginBottom:"18px"

                          }}

                        >

                          <div

                            style={{

                              display:"flex",

                              justifyContent:"space-between"

                            }}

                          >

                            <span>

                              Version {index+1}

                            </span>

                            <strong>

                              {score}%

                            </strong>

                          </div>

                          <div

                            style={{

                              marginTop:"6px",

                              height:"10px",

                              background:"#e5e7eb",

                              borderRadius:"20px"

                            }}

                          >

                            <div

                              style={{

                                width:`${score}%`,

                                height:"100%",

                                background:"#2563eb",

                                borderRadius:"20px"

                              }}

                            />

                          </div>

                        </div>

                      )

                    )

                  }

                </div>

              </div>

            </div>

            <div

              style={{

                background: colors.card,

                borderRadius:"18px",

                padding:"25px",

                boxShadow:

                  "0 10px 25px rgba(0,0,0,.06)",

                marginBottom:"30px"

              }}

            >

              <h2>

                🎯 Weekly Goals

              </h2>

              <div

                style={{

                  display:"grid",

                  gridTemplateColumns:

                    "repeat(auto-fit,minmax(250px,1fr))",

                  gap:"20px",

                  marginTop:"20px"

                }}

              >

                <div>

                  <strong>

                    Apply to Jobs

                  </strong>

                  <div

                    style={{

                      marginTop:"8px",

                      height:"10px",

                      background:"#e5e7eb",

                      borderRadius:"20px"

                    }}

                  >

                    <div

                      style={{

                        width:"75%",

                        height:"100%",

                        background:"#16a34a",

                        borderRadius:"20px"

                      }}

                    />

                  </div>

                </div>

                <div>

                  <strong>

                    Resume Updates

                  </strong>

                  <div

                    style={{

                      marginTop:"8px",

                      height:"10px",

                      background:"#e5e7eb",

                      borderRadius:"20px"

                    }}

                  >

                    <div

                      style={{

                        width:"90%",

                        height:"100%",

                        background:"#2563eb",

                        borderRadius:"20px"

                      }}

                    />

                  </div>

                </div>

                <div>

                  <strong>

                    Mock Interviews

                  </strong>

                  <div

                    style={{

                      marginTop:"8px",

                      height:"10px",

                      background:"#e5e7eb",

                      borderRadius:"20px"

                    }}

                  >

                    <div

                      style={{

                        width:"60%",

                        height:"100%",

                        background:"#f59e0b",

                        borderRadius:"20px"

                      }}

                    />

                  </div>

                </div>

              </div>

            </div>

		            <div

              style={{

                background: colors.card,

                borderRadius:"18px",

                padding:"25px",

                boxShadow:

                  "0 10px 25px rgba(0,0,0,.06)",

                marginBottom:"30px"

              }}

            >

              <h2>

                🚀 Career Recommendations

              </h2>

              <ul

                style={{

                  marginTop:"20px",

                  paddingLeft:"20px",

                  lineHeight:"2",

                  color:"#4b5563"

                }}

              >

                <li>

                  Complete AWS Solutions Architect Certification.

                </li>

                <li>

                  Learn Helm and ArgoCD for Kubernetes deployments.

                </li>

                <li>

                  Build more real-world DevOps projects.

                </li>

                <li>

                  Improve ATS score above 95%.

                </li>

                <li>

                  Apply to at least 5 matching jobs every week.

                </li>

              </ul>

            </div>

          </>

        )

      }

</div>

</Layout>

);

}

function Card({

title,

value,

color

}){

return(

<div

style={{

background: colors.card,

padding:"25px",

borderRadius:"18px",

boxShadow:"0 10px 25px rgba(0,0,0,.06)",

borderTop:`5px solid ${color}`

}}

>

<h3

style={{

margin:0,

color:"#6b7280",

fontWeight:"500"

}}

>

{title}

</h3>

<h1

style={{

marginTop:"20px",

marginBottom:"0",

fontSize:"38px",

color

}}

>

{value}

</h1>

</div>

);

}

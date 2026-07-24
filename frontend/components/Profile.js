import { useState } from "react";

import Button from "./ui/Button";
import Loader from "./ui/Loader";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {

  const { colors } = useTheme();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/profile/",

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

      if (!response.ok) {
	  alert(data.detail || data.message || "Unable to load profile.");
	  return;
      }

      setProfile(data);

    }

    catch(error){

      console.error(error);

      alert("Unable to load profile.");

    }

    finally{

      setLoading(false);

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

<h2>

My Profile

</h2>

<p

style={{

color: colors.subText

}}

>

Manage your AI Job Assistant profile.

</p>

<div

style={{

marginTop:"20px"

}}

>

<Button

onClick={loadProfile}

>

Load Profile

</Button>

</div>

	      {

        loading && (

          <Loader

            text="Loading Profile..."

          />

        )

      }

      {

        profile && (

          <div

            style={{

              marginTop: "30px",

              background: colors.background,
              border: colors.borderStyle,

              borderRadius: "18px",

              padding: "30px",

              color: colors.text,

              boxShadow: "0 5px 15px rgba(0,0,0,.05)"

            }}

          >

            <div

              style={{

                display: "flex",

                alignItems: "center",

                gap: "20px",

                flexWrap: "wrap"

              }}

            >

              <div

                style={{

                  width: "90px",

                  height: "90px",

                  borderRadius: "50%",

                  background: "#2563eb",

                  color: "#ffffff",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  fontSize: "34px",

                  fontWeight: "bold"

                }}

              >

                {

                  profile.name

                  ?

                  profile.name.charAt(0).toUpperCase()

                  :

                  "U"

                }

              </div>

              <div>

                <h2

                  style={{

                    margin: 0

                  }}

                >

                  {profile.name || "Unknown User"}

                </h2>

                <p

                  style={{

                    marginTop: "8px",

                    color: colors.subText

                  }}

                >

                  {profile.email || "No Email"}

                </p>

                <p

                  style={{

                    color: colors.subText,

                    fontSize: "14px"

                  }}

                >

                  Joined:

                  {" "}

                  {profile.created_at || "N/A"}

                </p>

              </div>

            </div>

            <div

              style={{

                display: "grid",

                gridTemplateColumns:

                  "repeat(auto-fit,minmax(220px,1fr))",

                gap: "20px",

                marginTop: "30px"

              }}

            >

              <div

                style={{

                  background: "#eff6ff",

                  borderRadius: "12px",

                  padding: "20px"

                }}

              >

                <h4

                  style={{

                    marginTop: 0,

                    color: "#2563eb"

                  }}

                >

                  Uploaded Resumes

                </h4>

                <h2>

                  {

                    profile.uploaded_resumes || 0

                  }

                </h2>

              </div>

              <div

                style={{

                  background: "#ecfdf5",

                  borderRadius: "12px",

                  padding: "20px"

                }}

              >

                <h4

                  style={{

                    marginTop: 0,

                    color: "#16a34a"

                  }}

                >

                  Generated Resumes

                </h4>

                <h2>

                  {

                    profile.generated_resumes || 0

                  }

                </h2>

              </div>

            </div>

            <div

              style={{

                marginTop: "30px"

              }}

            >

		              <h3>

                Profile Completion

              </h3>

              <div

                style={{

                  width: "100%",

                  height: "14px",

                  background: colors.background,

                  borderRadius: "20px",

                  overflow: "hidden",

                  marginTop: "15px"

                }}

              >

                <div

                  style={{

                    width: "90%",

                    height: "100%",

                    background: "#16a34a"

                  }}

                />

              </div>

              <p

                style={{

                  marginTop: "10px",

                  color: colors.subText

                }}

              >

                90% Complete

              </p>

            </div>

            <div

              style={{

                marginTop: "35px",

                padding: "20px",

                borderRadius: "12px",

                background: colors.background,
                border: colors.borderStyle

              }}

            >

              <h3

                style={{

                  marginTop: 0,

                  color: "#2563eb"

                }}

              >

                🤖 AI Career Suggestions

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

                  Complete your AWS certification.

                </li>

                <li>

                  Add Terraform and Kubernetes projects.

                </li>

                <li>

                  Improve your ATS score above 90%.

                </li>

                <li>

                  Apply to at least five matching jobs every week.

                </li>

                <li>

                  Practice mock interviews regularly.

                </li>

              </ul>

            </div>

            <div

              style={{

                marginTop: "25px",

                padding: "20px",

                background: "#eff6ff",

                borderRadius: "12px",

                border: "1px solid #bfdbfe"

              }}

            >

              <h3

                style={{

                  marginTop: 0,

                  color: "#1d4ed8"

                }}

              >

                📈 Resume Improvement Tips

              </h3>

              <ul

                style={{

                  margin: 0,

                  paddingLeft: "20px",

                  lineHeight: "1.9",

                  color: colors.text

                }}

              >

                <li>

                  Quantify achievements with numbers.

                </li>

                <li>

                  Keep your resume to one page.

                </li>

                <li>

                  Include GitHub and LinkedIn links.

                </li>

                <li>

                  Update your skills regularly.

                </li>

                <li>

                  Tailor your resume for each application.

                </li>

              </ul>

            </div>

          </div>

        )

      }

    </div>

  );

}

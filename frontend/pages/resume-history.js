import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ResumeHistory() {
  const { colors } = useTheme();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory = async () => {

    try {

      const response = await fetch(

        "/api/resume-history/"

      );

      const data = await response.json();

      setHistory(

        Array.isArray(data)

        ? data

        : data.history || []

      );

    }

    catch {

      alert("Unable to load history.");

    }

    finally {

      setLoading(false);

    }

  };

  const openResume = (id) => {

    window.open(

      `/api/resume-view/${id}`,

      "_blank"

    );

  };

  return (

    <div

      style={{

        maxWidth:"1200px",

        margin:"40px auto",

        background: colors.card,
border: colors.borderStyle,

        padding:"35px",

        borderRadius:"20px",

        boxShadow:"0 15px 35px rgba(0,0,0,.08)"

      }}

    >

      <h1>

        Resume History

      </h1>

      <p

        style={{

          color: colors.subText

        }}

      >

        All Generated Resumes

      </p>

      {

        loading &&

        <p>

          Loading...

        </p>

      }

      {

        !loading && history.length===0 &&

        <p>

          No Resume History Found

        </p>

      }

      {

        history.map((resume)=>(

          <div

            key={resume.id}

            style={{

              border:"1px solid #e5e7eb",

              borderRadius:"15px",

              padding:"20px",

              marginTop:"20px"

            }}

          >

            <div

              style={{

                display:"flex",

                justifyContent:"space-between",

                alignItems:"center"

              }}

            >

              <div>

                <h3>

                  {resume.filename || "Resume"}

                </h3>

                <p>

                  Skills:

                  {" "}

                  {resume.skills || "N/A"}

                </p>

                <p>

                  Created:

                  {" "}

                  {resume.created_at}

                </p>

              </div>
              <button

                onClick={() =>

                  openResume(

                    resume.id

                  )

                }

                style={{

                  padding:"12px 20px",

                  border:"none",

                  background:"#2563eb",

                  color:"#fff",

                  borderRadius:"10px",

                  cursor:"pointer"

                }}

              >

                View Resume

              </button>

            </div>

          </div>

        ))

      }

    </div>

  );

}

import { useState } from "react";

import Button from "./ui/Button";
import Loader from "./ui/Loader";

export default function ResumeCenter() {

  const [filename, setFilename] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const generateATSResume = async () => {

    if (!filename || !jobDescription) {

      alert("Please enter filename and job description.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/auto-resume/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            filename,

            job_description: jobDescription

          })

        }

      );

      const data = await response.json();

      alert(

        data.message ||

        "ATS Resume Generated Successfully."

      );

    }

    catch (error) {

      console.error(error);

      alert("Unable to generate ATS Resume.");

    }

    finally {

      setLoading(false);

    }

  };

  const downloadTXT = () => {

    window.open(

      "/api/download/resume-txt",

      "_blank"

    );

  };

  const downloadPDF = () => {

    window.open(

      "/api/download/resume-pdf",

      "_blank"

    );

  };

  const downloadATS = () => {

    window.open(

      "/api/download/ats-resume",

      "_blank"

    );

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

        Resume Center

      </h2>

      <p

        style={{

          color: "#6b7280"

        }}

      >

        Generate an ATS-friendly resume based on the selected job description.

      </p>

	        <input

        type="text"

        placeholder="Uploaded Resume Filename"

        value={filename}

        onChange={(e) =>

          setFilename(

            e.target.value

          )

        }

        style={{

          width: "100%",

          padding: "15px",

          borderRadius: "12px",

          border: "1px solid #d1d5db",

          marginTop: "20px",

          fontSize: "15px"

        }}

      />

      <textarea

        rows="8"

        placeholder="Paste Job Description..."

        value={jobDescription}

        onChange={(e) =>

          setJobDescription(

            e.target.value

          )

        }

        style={{

          width: "100%",

          padding: "15px",

          borderRadius: "12px",

          border: "1px solid #d1d5db",

          marginTop: "20px",

          resize: "vertical",

          fontSize: "15px"

        }}

      />

      <div

        style={{

          marginTop: "25px"

        }}

      >

        {

          loading

          ?

          <Loader

            text="Generating ATS Resume..."

          />

          :

          <Button

            fullWidth

            onClick={

              generateATSResume

            }

          >

            Generate ATS Resume

          </Button>

        }

      </div>

      <div

        style={{

          marginTop: "35px",

          borderTop: "1px solid #e5e7eb",

          paddingTop: "25px"

        }}

      >

        <h3

          style={{

            marginTop: 0,

            marginBottom: "20px"

          }}

        >

          Downloads

        </h3>

        <div

          style={{

            display: "flex",

            gap: "15px",

            flexWrap: "wrap"

          }}

        >

	            <Button

            variant="secondary"

            onClick={downloadTXT}

          >

            Download TXT

          </Button>

          <Button

            variant="primary"

            onClick={downloadPDF}

          >

            Download PDF

          </Button>

          <Button

            variant="success"

            onClick={downloadATS}

          >

            Download ATS Resume

          </Button>

        </div>

      </div>

      <div

        style={{

          marginTop: "35px",

          background: "#f8fafc",

          borderRadius: "12px",

          padding: "20px",

          border: "1px solid #e5e7eb"

        }}

      >

        <h3

          style={{

            marginTop: 0,

            color: "#2563eb"

          }}

        >

          Resume Tips

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

            Use keywords from the job description.

          </li>

          <li>

            Highlight measurable achievements.

          </li>

          <li>

            Keep your resume ATS-friendly.

          </li>

          <li>

            Include cloud, DevOps and automation projects.

          </li>

          <li>

            Export the final resume as PDF before applying.

          </li>

        </ul>

      </div>

    </div>

  );

}

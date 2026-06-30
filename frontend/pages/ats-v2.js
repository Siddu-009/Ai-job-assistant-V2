import { useState } from "react";
import Layout from "../components/Layout";

import ATSHeader from "../components/ats/ATSHeader";
import ResumeReview from "../components/ats/ResumeReview";
import JobMatch from "../components/ats/JobMatch";
import ResultDashboard from "../components/ats/ResultDashboard";

export default function ATSAnalyzerV2() {

  const [tab, setTab] = useState("review");

  const [loading, setLoading] = useState(false);

  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);

  const analyzeResume = async () => {

    alert("Resume Review API will be connected in next step.");

  };

  const analyzeJob = async () => {

    if (!jobDescription.trim()) {

      alert("Please paste a Job Description.");

      return;

    }

    setLoading(true);

    /*
       Backend API will be connected
       in next step.
    */

    setTimeout(() => {

      setResult({

        score: 87,

        verdict: "Excellent Match",

        matched_skills: [

          "AWS",

          "Docker",

          "Terraform",

          "Git"

        ],

        missing_skills: [

          "Kubernetes",

          "Helm",

          "ArgoCD"

        ],

        recommendations: [

          "Add Kubernetes project experience.",

          "Mention Helm deployments.",

          "Include measurable achievements."

        ]

      });

      setLoading(false);

    },1000);

  };

  return (

    <Layout
      title="ATS Resume Analyzer"
      subtitle="Professional ATS Analysis"
    >

      <div
        style={{
          maxWidth:"1200px",
          margin:"0 auto"
        }}
      >

        <ATSHeader
          tab={tab}
          setTab={setTab}
        />

        {

          tab==="review"

          ?

          <ResumeReview

            loading={loading}

            analyzeResume={analyzeResume}

          />

          :

          <JobMatch

            loading={loading}

            analyzeJob={analyzeJob}

            jobDescription={jobDescription}

            setJobDescription={setJobDescription}

          />

        }

        {

          result && (

            <ResultDashboard

              result={result}

            />

          )

        }

      </div>

    </Layout>

  );

}

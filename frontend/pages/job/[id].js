import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function JobDetails() {

    const router = useRouter();

    const { id } = router.query;

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (id) {

            loadJob();

        }

    }, [id]);

    const loadJob = async () => {

        try {

            const response = await fetch(
                `/api/jobs/details/${id}`
            );

            const data = await response.json();

            setJob(data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading)
        return <h2 style={{padding:"40px"}}>Loading...</h2>;

    if (!job)
        return <h2 style={{padding:"40px"}}>Job not found</h2>;

    return (

        <div
            style={{
                maxWidth:"1000px",
                margin:"40px auto",
                background:"#fff",
                padding:"30px",
                borderRadius:"20px",
                boxShadow:"0 10px 30px rgba(0,0,0,.08)"
            }}
        >

            <h1>{job.title}</h1>

            <h3>{job.company}</h3>

            <p>📍 {job.location}</p>

            <hr/>

            <h3>Skills</h3>

            <p>{job.skills}</p>

            <hr/>

            <a

                href={job.apply_url}

                target="_blank"

                rel="noreferrer"

                style={{

                    display:"inline-block",

                    marginTop:"20px",

                    background:"#2563eb",

                    color:"#fff",

                    padding:"12px 24px",

                    borderRadius:"10px",

                    textDecoration:"none"

                }}

            >

                Apply on Company Website

            </a>

        </div>

    );

}
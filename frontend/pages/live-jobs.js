import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function LiveJobs() {
    const { colors } = useTheme();

    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        searchJobs();
    }, [page]);

    const searchJobs = async () => {

        setLoading(true);

        try {

            console.log({
                keyword,
                location
            });

            const response = await fetch(
                "/api/jobs/search",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        keyword,
                        location,
                        experience,
                        page,
                        limit: 20
                    })
                }
            );

            const data = await response.json();

            if (Array.isArray(data.jobs)) {
                setJobs(data.jobs);
                setPages(data.pages || 1);
            } else {
                setJobs([]);
                setPages(1);
            }

        } catch (err) {

            console.error(err);
            alert("Unable to search jobs.");

        }

        setLoading(false);

    };

    const saveJob = async (job) => {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {

            const addResponse = await fetch("/api/jobs/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    skills: "",
                    apply_url: job.apply_url
                })
            });

            const addedJob = await addResponse.json();

            const response = await fetch("/api/saved-jobs/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token,
                    job_id: addedJob.id
                })
            });

            const data = await response.json();

            alert(data.message || "Job Saved");

        } catch (err) {

            console.error(err);
            alert("Unable to save job.");

        }

    };

    const applyJob = async (job) => {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {

            const addResponse = await fetch("/api/jobs/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    skills: "",
                    apply_url: job.apply_url
                })
            });

            const addedJob = await addResponse.json();

            const response = await fetch("/api/applications/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token,
                    job_id: addedJob.id
                })
            });

            const data = await response.json();

            alert(data.message || "Application Submitted");

        } catch (err) {

            console.error(err);
            alert("Unable to apply.");

        }

    };

    return (

        <div
            style={{
                maxWidth: "1300px",
                margin: "40px auto",
                background: colors.card,
                padding: "35px",
                borderRadius: "20px",
                boxShadow: "0 15px 35px rgba(0,0,0,.08)"
            }}
        >

            <h1>Live Jobs</h1>

            <p style={{ color: colors.subText }}>
                Search jobs from multiple job portals.
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:"2fr 1fr 180px 150px",
                    gap: "15px",
                    marginTop: "25px"
                }}
            >

                <input
                    placeholder="Job Title"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setPage(1);
                            searchJobs();
                        }
                    }}
                    style={input}
                />

                <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setPage(1);
                            searchJobs();
                        }
                    }}
                    style={input}
                />

                <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    style={input}
                >
                    <option value="">Any Experience</option>
                    <option value="0">Fresher</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                    <option value="6">6 Years</option>
                    <option value="7">7 Years</option>
                    <option value="8">8 Years</option>
                    <option value="9">9 Years</option>
                    <option value="10">10 Years</option>
                    <option value="11">11 Years</option>
                    <option value="12">12 Years</option>
                    <option value="13">13 Years</option>
                    <option value="14">14 Years</option>
                    <option value="15">15+ Years</option>
                </select>

                <button
                    onClick={() => {
                        setPage(1);
                        searchJobs();
                    }}

                    style={button}
                >
                    {loading ? "Searching..." : "Search"}
                </button>

            </div>

            {jobs.map((job) => (

                <div
                    key={job.id}
                    style={{
                        marginTop: "25px",
                        padding: "25px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "15px"
                    }}
                >

                    <h2
                    style={{
                    marginBottom:"5px",
                    fontSize:"24px"
                    }}
                    >
                    {job.title}
                    </h2>

                    <p
                    style={{
                    color:"#2563eb",
                    fontWeight:"600"
                    }}
                    >
                    🏢 {job.company}
                    </p>

                    <p
                    style={{
                    color: colors.subText
                    }}
                    >
                    📍 {job.location || "Remote"}
                    </p>

                    <p
                    style={{
                    color:"#16a34a",
                    fontWeight:"600"
                    }}
                    >
                    💰 {job.salary || "Not Mentioned"}
                    </p>
                    
                    <div
                    style={{
                    display:"flex",
                    gap:"10px",
                    flexWrap:"wrap",
                    marginTop:"12px"
                    }}
                    >

                    <span
                    style={{
                    background:"#dbeafe",
                    padding:"6px 12px",
                    borderRadius:"20px"
                    }}
                    >
                    🌍 {job.source}
                    </span>

                    <span
                    style={{
                    background: colors.successBg || "#dcfce7",
                    padding:"6px 12px",
                    borderRadius:"20px"
                    }}
                    >
                    💼 {job.employment_type || "Full Time"}
                    </span>

                    </div>

                    <p
                    style={{
                    marginTop:"15px",
                    color:"#4b5563",
                    lineHeight:"1.7"
                    }}
                    >

                    {job.description
                    ? job.description.substring(0,180)+"..."
                    : "No description available."}

                    {job.apply_url && (
                        <a
                            href={job.apply_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                marginTop: "15px",
                                display: "inline-block",
                                color: "#2563eb",
                                fontWeight: "600",
                                textDecoration: "none"
                            }}
                        >
                            🔗 View Original Job
                        </a>
                    )}

                    </p>

                    <div
                        style={{
                            display: "inline-block",
                            background: "#dbeafe",
                            padding: "8px 14px",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            color: "#1d4ed8",
                            marginTop: "10px"
                        }}
                    >
                        ⭐ AI Match {job.match_score ?? 0}%
                    </div>

                    <div
                    style={{
                    display:"flex",
                    gap:"15px",
                    marginTop:"20px"
                    }}
                    >

                    <button
                    style={saveButton}
                    onClick={()=>saveJob(job)}
                    >

                    ⭐ Save Job

                    </button>

                    <button
                    style={applyButton}
                    onClick={()=>applyJob(job)}
                    >

                    🚀 Apply Now

                    </button>

                    </div>

                </div>

            ))}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {pages}
                </span>

                <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

            </div>

        </div>

    );

}

const input = {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db"
};

const button = {
    padding: "14px 25px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer"
};

const saveButton = {
    flex: 1,
    padding: "14px",
    background: "#f59e0b",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer"
};

const applyButton = {
    flex: 1,
    padding: "14px",
    background: "#16a34a",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer"
};
import api from "./api";

export const atsScore = (resume, job_description) =>

  api.post("/ats-score", {

    resume,

    job_description

  });

export const getResumeList = async () => {

    const token = localStorage.getItem("token");

    return api.get(`/resume/list/${token}`);
};

export const generateResume = (

  filename,

  job_description

) =>

  api.post("/auto-resume", {

    filename,

    job_description

  });

export const getResumes = async () => {
    const token = localStorage.getItem("token");

    return api.get(`/resume/list/${token}`);
}

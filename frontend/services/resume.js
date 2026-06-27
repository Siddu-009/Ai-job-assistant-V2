import api from "./api";

export const atsScore = (resume, job_description) =>

  api.post("/ats-score", {

    resume,

    job_description

  });

export const generateResume = (

  filename,

  job_description

) =>

  api.post("/auto-resume", {

    filename,

    job_description

  });

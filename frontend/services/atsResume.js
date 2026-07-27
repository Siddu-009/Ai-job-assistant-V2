import api from "./api";

export const generateATSResume = async (resumeId) => {

    const token = localStorage.getItem("token");

    return api.post("/api/ats-resume-generator/", {
        token,
        resume_id: resumeId
    });

};
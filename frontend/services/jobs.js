import api from "./api";

export const getRecommendedJobs = () =>

  api.post("/recommend-jobs");

export const getSavedJobs = (token) =>

  api.get(`/saved-jobs/${token}`);

export const removeSavedJob = (id) =>

  api.delete(`/saved-jobs/${id}`);

export const applyJob = (jobId) =>

  api.post("/applications/apply", {

    job_id: jobId

  });

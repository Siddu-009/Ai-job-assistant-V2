import api from "./api";

export const getAnalytics = () => {
  console.log("Analytics API called");
  console.log("Base URL:", api.defaults.baseURL);

  return api.post("/analytics-dashboard");
};
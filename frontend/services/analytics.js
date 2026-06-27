import api from "./api";

export const getAnalytics = () =>

  api.post("/analytics-dashboard");

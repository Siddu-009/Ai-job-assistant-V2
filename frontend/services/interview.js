import api from "./api";

export const mockInterview = (data) =>

  api.post("/mock-interview", data);

import api from "./api";

export const mockTest = (data) =>

  api.post("/mock-test", data);

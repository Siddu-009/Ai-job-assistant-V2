import api from "./api";

export const getProfile = () =>

  api.post("/profile");

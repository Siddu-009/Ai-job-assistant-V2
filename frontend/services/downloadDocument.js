import api from "./api";

export const getDocumentUrl = (documentType) => {
  const token = localStorage.getItem("token");

  return `${api.defaults.baseURL}/download-document/${documentType}/${token}`;
};
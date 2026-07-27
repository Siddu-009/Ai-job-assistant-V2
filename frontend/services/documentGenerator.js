import api from "./api";

export const generateDocument = async (resumeId, documentType) => {
  const token = localStorage.getItem("token");

  return api.post(
    "/generate-document/",
    {
      token,
      resume_id: resumeId,
      document_type: documentType,
    },
    {
      responseType: "blob",
    }
  );
};
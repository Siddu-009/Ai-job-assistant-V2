import api from "./api";

export const convertResume = (formData) => {

    return api.post(

        "/resume-converter",

        formData,

        {
            responseType: "blob"
        }

    );

};
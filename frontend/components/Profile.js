import { useState } from "react";

export default function Profile() {

  const [profile, setProfile] =
    useState(null);

  const loadProfile = async () => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "/api/profile/",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          token
        })
      }
    );

    const data =
      await response.json();

    setProfile(data);
  };

  return (

    <div
      style={{
        marginTop: "30px",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #ddd"
      }}
    >

      <h2>
        User Profile
      </h2>

      <button
        onClick={loadProfile}
      >
        Load Profile
      </button>

      <br />
      <br />

      {
        profile && (

          <div>

            <p>
              <strong>Name:</strong>
              {" "}
              {profile.name}
            </p>

            <p>
              <strong>Email:</strong>
              {" "}
              {profile.email}
            </p>

            <p>
              <strong>Joined:</strong>
              {" "}
              {profile.created_at}
            </p>

            <p>
              <strong>Uploaded Resumes:</strong>
              {" "}
              {profile.uploaded_resumes}
            </p>

            <p>
              <strong>Generated Resumes:</strong>
              {" "}
              {profile.generated_resumes}
            </p>

          </div>

        )
      }

    </div>

  );

}

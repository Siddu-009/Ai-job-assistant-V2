import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { colors } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadProfile() {

      const token = localStorage.getItem("token");

      if (!token) {

        setLoading(false);

        return;

      }

      try {

        const response = await fetch("/api/profile/", {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token

          })

        });

        const data = await response.json();

        setProfile(data);

      }

      catch (err) {

        console.error(err);

      }

      setLoading(false);

    }

    loadProfile();

  }, []);

  return (

    <Layout title="Profile">

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          background: colors.card,
border: colors.borderStyle,
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,.08)"
        }}
      >

        <h1>👤 My Profile</h1>

        {

          loading ?

          <p>Loading profile...</p>

          :

          profile ?

          <>

            <div style={card}>

              <h2>{profile.name}</h2>

              <p>

                <b>Email:</b> {profile.email}

              </p>

              <p>

                <b>Member Since:</b> {profile.created_at}

              </p>

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "25px"
              }}
            >

              <div style={statCard}>

                <h2>

                  {profile.uploaded_resumes}

                </h2>

                <p>

                  Uploaded Resumes

                </p>

              </div>

              <div style={statCard}>

                <h2>

                  {profile.generated_resumes}

                </h2>

                <p>

                  AI Generated Resumes

                </p>

              </div>

            </div>

          </>

          :

          <p>

            Unable to load profile.

          </p>

        }

      </div>

    </Layout>

  );

}

const card = {

  marginTop: "25px",

  background: "#f8fafc",

  padding: "20px",

  borderRadius: "12px"

};

const statCard = {

  background: "#2563eb",

  color: "#fff",

  padding: "25px",

  textAlign: "center",

  borderRadius: "15px"

};
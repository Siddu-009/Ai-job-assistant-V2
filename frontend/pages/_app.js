import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../styles/resume-converter.css";
import "../styles/recommended-jobs.css";
import { ThemeProvider } from "../context/ThemeContext";


const PUBLIC_ROUTES = [
  "/login",
  "/register"
];

export default function App({ Component, pageProps }) {

  const router = useRouter();

  const [ready, setReady] = useState(false);

  useEffect(() => {

    if (PUBLIC_ROUTES.includes(router.pathname)) {

      setReady(true);

      return;

    }

    const token = localStorage.getItem("token");

    if (!token) {

      router.replace("/login");

      return;

    }

    setReady(true);

  }, [router.pathname]);

  if (!ready) {

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
          fontWeight: 600
        }}
      >
        Loading...
      </div>
    );

  }

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );

}

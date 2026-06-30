import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../services/auth";

export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            await login(
                email,
                password
            );

            router.push("/");

        }

        catch (err) {

            setError(
                err.message || "Login Failed"
            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f7fb"
            }}
        >

            <form
                onSubmit={handleLogin}
                style={{
                    width: 420,
                    background: "#fff",
                    padding: 40,
                    borderRadius: 12,
                    boxShadow: "0 8px 30px rgba(0,0,0,.08)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: 10
                    }}
                >
                    AI Job Assistant
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: 30
                    }}
                >
                    Login to continue
                </p>

                {
                    error &&
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: 12,
                            marginBottom: 20,
                            borderRadius: 8
                        }}
                    >
                        {error}
                    </div>
                }

                <label>Email</label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                    style={{
                        width: "100%",
                        padding: 12,
                        marginTop: 6,
                        marginBottom: 20,
                        borderRadius: 8,
                        border: "1px solid #ddd"
                    }}
                />

                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                    style={{
                        width: "100%",
                        padding: 12,
                        marginTop: 6,
                        marginBottom: 30,
                        borderRadius: 8,
                        border: "1px solid #ddd"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: 14,
                        background: "#2563eb",
                        color: "#fff",
                        border: 0,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 16
                    }}
                >

                    {
                        loading
                            ? "Logging in..."
                            : "Login"
                    }

                </button>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: 20
                    }}
                >

                    Don't have an account?

                    <br />

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/register")
                        }
                        style={{
                            marginTop: 10,
                            background: "transparent",
                            border: 0,
                            color: "#2563eb",
                            cursor: "pointer",
                            fontWeight: 600
                        }}
                    >
                        Register Here
                    </button>

                </div>

            </form>

        </div>

    );

}

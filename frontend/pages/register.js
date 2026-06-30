import { useState } from "react";
import { useRouter } from "next/router";
import { register } from "../services/auth";

export default function Register() {

    const router = useRouter();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    async function handleRegister(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        setSuccess("");

        try {

            await register(
                name,
                email,
                password
            );

            setSuccess(
                "Registration successful. Please login."
            );

            setTimeout(() => {

                router.push("/login");

            }, 1500);

        }

        catch (err) {

            setError(
                err.message || "Registration Failed"
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
                onSubmit={handleRegister}
                style={{
                    width: 430,
                    background: "#fff",
                    padding: 40,
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: 10
                    }}
                >
                    Create Account
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: 25
                    }}
                >
                    AI Job Assistant
                </p>

                {
                    error &&
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 15
                        }}
                    >
                        {error}
                    </div>
                }

                {
                    success &&
                    <div
                        style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 15
                        }}
                    >
                        {success}
                    </div>
                }

                <label>Name</label>

                <input
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    style={inputStyle}
                />

                <label>Email</label>

                <input
                    required
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    style={inputStyle}
                />

                <label>Password</label>

                <input
                    required
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    style={inputStyle}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={buttonStyle}
                >

                    {
                        loading
                        ? "Creating..."
                        : "Register"
                    }

                </button>

                <div
                    style={{
                        textAlign:"center",
                        marginTop:20
                    }}
                >

                    Already have an account?

                    <br/>

                    <button
                        type="button"
                        onClick={()=>router.push("/login")}
                        style={linkStyle}
                    >

                        Login

                    </button>

                </div>

            </form>

        </div>

    );

}

const inputStyle={

    width:"100%",
    padding:12,
    marginTop:6,
    marginBottom:18,
    border:"1px solid #ddd",
    borderRadius:8

};

const buttonStyle={

    width:"100%",
    padding:14,
    background:"#2563eb",
    color:"#fff",
    border:0,
    borderRadius:8,
    cursor:"pointer",
    fontSize:16

};

const linkStyle={

    background:"transparent",
    border:0,
    color:"#2563eb",
    cursor:"pointer",
    marginTop:10,
    fontWeight:600

};

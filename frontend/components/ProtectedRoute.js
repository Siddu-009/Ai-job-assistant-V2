import { useRouter } from "next/router";
import Loader from "./ui/Loader";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {

    try {
        await api.get("/verify-token");
        setLoading(false);
    } catch {
        router.replace("/login");
    }

    const router = useRouter();

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;

        if (!token?.trim()) {

            router.replace("/login");

            return;

        }

        setLoading(false);

    },[router]);

    if(loading){

        return(

            <div
                style={{
                    height:"100vh",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    fontSize:22,
                    fontWeight:600
                }}
            >

                Loading...

            </div>

        );

    }

    return children;

}

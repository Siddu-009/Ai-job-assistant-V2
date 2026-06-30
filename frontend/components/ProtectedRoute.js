import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {

    const router = useRouter();

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        const token=localStorage.getItem("token");

        if(!token){

            router.replace("/login");

            return;

        }

        setLoading(false);

    },[]);

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

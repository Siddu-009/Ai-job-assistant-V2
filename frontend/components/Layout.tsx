import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({
    children
}: LayoutProps) {

    return (

        <div className="app-layout">

            <Sidebar collapsed={undefined} setCollapsed={undefined} />

            <div className="layout-content">

                <Navbar />

                <main className="page-content">

                    {children}

                </main>

            </div>

        </div>

    );

}
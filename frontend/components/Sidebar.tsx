import Link from "next/link";
import { useRouter } from "next/router";

import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Target,
    BrainCircuit,
    Settings
} from "lucide-react";

const menus = [

    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard
    },

    {
        title: "Resume Center",
        href: "/resume-center",
        icon: FileText
    },

    {
        title: "ATS Analyzer",
        href: "/ats-score",
        icon: Target
    },

    {
        title: "Jobs",
        href: "/jobs",
        icon: Briefcase
    },

    {
        title: "AI Tools",
        href: "/career-coach",
        icon: BrainCircuit
    },

    {
        title: "Settings",
        href: "/settings",
        icon: Settings
    }

];

export default function Sidebar() {

    const router = useRouter();

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                AI Job Assistant

            </div>

            {menus.map((item) => {

                const Icon = item.icon;

                const active = router.pathname === item.href;

                return (

                    <Link
                        key={item.href}
                        href={item.href}
                        className={
                            active
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                    >

                        <Icon size={18} />

                        {item.title}

                    </Link>

                );

            })}

        </aside>

    );

}
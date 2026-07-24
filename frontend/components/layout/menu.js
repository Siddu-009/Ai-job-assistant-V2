import {
  Home,
  Upload,
  FileText,
  Sparkles,
  History,
  Layers3,
  BadgeCheck,
  Brain,
  GraduationCap,
  Map,
  MessageCircle,
  ClipboardList,
  Briefcase,
  Search,
  Bell,
  FolderKanban,
  Users,
  Shield,
  BarChart3,
  Download,
  User,
  Settings
} from "lucide-react";

const menu = [

{
title:"MAIN",

items:[
{
label:"Dashboard",
href:"/",
icon:Home
},
{
label:"Analytics",
href:"/analytics",
icon:BarChart3
},
{
label:"Notifications",
href:"/notifications",
icon:Bell
}
]
},

{
title:"RESUME",

items:[
{
label:"Resume Upload",
href:"/upload",
icon:Upload
},
{
label:"Resume Builder",
href:"/resume-builder",
icon:FileText
},
{
label:"Resume Enhancer",
href:"/resume-enhancer",
icon:Sparkles
},
{
label:"Resume Tailoring",
href:"/resume-tailoring",
icon:Sparkles
},
{
label:"Resume Compare",
href:"/resume-compare",
icon:Layers3
},
{
label:"Resume History",
href:"/resume-history",
icon:History
},
{
label:"Resume Versions",
href:"/resume-versions",
icon:Layers3
},
{
    label: "Resume Center",
    href: "/resume-center",
    icon: FileText,
}
]
},

{
title:"AI TOOLS",

items:[
{
label:"ATS Analyzer",
href:"/ats",
icon:BadgeCheck
},
{
label:"Skill Gap",
href:"/skill-gap",
icon:Brain
},
{
label:"Learning",
href:"/learning-recommendations",
icon:GraduationCap
},
{
label:"Career Coach",
href:"/career-coach",
icon:MessageCircle
},
{
label:"Career Roadmap",
href:"/career-roadmap",
icon:Map
},
{
label:"Interview Questions",
href:"/interview-questions",
icon:ClipboardList
},
{
label:"Mock Test",
href:"/mock-test",
icon:ClipboardList
},
{
label:"Cover Letter",
href:"/cover-letter",
icon:FileText
}
]
},

{
title:"JOBS",

items:[
{
label:"Live Jobs",
href:"/live-jobs",
icon:Search
},
{
label:"Recommendations",
href:"/job-recommendations",
icon:Briefcase
},
{
label:"Saved Jobs",
href:"/saved-jobs",
icon:Briefcase
},
{
label:"Applications",
href:"/applications",
icon:FolderKanban
},
{
label:"Job Tracker",
href:"/job-tracker",
icon:FolderKanban
},
{
label:"Application Status",
href:"/application-status",
icon:FolderKanban
},
{
label:"Job Alerts",
href:"/job-alerts",
icon:Bell
},
{
label:"Workflow",
href:"/application-workflow",
icon:FolderKanban
}
]
},

{
title:"RECRUITER",

items:[
{
label:"Recruiter Dashboard",
href:"/recruiter-dashboard",
icon:Users
},
{
label:"Candidate Search",
href:"/candidate-search",
icon:Search
},
{
label:"Recruiter Analytics",
href:"/recruiter-analytics",
icon:BarChart3
}
]
},

{
title:"ADMIN",

items:[
{
label:"Admin Dashboard",
href:"/admin",
icon:Shield
},
{
label:"Admin Management",
href:"/admin-management",
icon:Shield
},
{
label:"Downloads",
href:"/downloads",
icon:Download
},
{
label:"Profile",
href:"/profile",
icon:User
},
{
label:"Settings",
href:"/settings",
icon:Settings
}
]
}

];

export default menu;

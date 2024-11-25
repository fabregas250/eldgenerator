import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flag, 
  Users, 
  UserSquare2, 
  GraduationCap,
  School2,
  School,
  Building2,
  Plane,
  FileText,
  FileSignature,
  CalendarDays,
  Users2,
  UserCog,
  Handshake,
  FileBarChart,
  Trophy,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Timer,
  Radio
} from 'lucide-react';

const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Match Operator",
    path: "/match-operator",
    icon: Timer,
    count: "LIVE",
    badge: "bg-red-500 text-white"
  },
  {
    title: "National Teams",
    path: "/national-teams",
    icon: Flag,
    count: "78"
  },
  {
    title: "Federations",
    path: "/federations",
    icon: Users,
    count: "6"
  },
  {
    title: "Sports professionals",
    path: "/sports-professionals",
    icon: UserSquare2,
    count: "23"
  },
  {
    title: "Trainings",
    path: "/trainings",
    icon: GraduationCap
  },
  {
    title: "Isonga professionals",
    path: "/isonga-programs",
    icon: School2,
    count: "09"
  },
  {
    title: "Academies",
    path: "/academies",
    icon: School
  },
  {
    title: "Infrastructure",
    path: "/infrastructure",
    icon: Building2,
    count: "12"
  },
  {
    title: "Sports tourism",
    path: "/sports-tourism",
    icon: Plane
  },
  {
    title: "Documents",
    path: "/documents",
    icon: FileText,
    count: "23"
  },
  {
    title: "Contracts",
    path: "/contracts",
    icon: FileSignature
  },
  {
    title: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    count: "6"
  },
  {
    title: "Employee",
    path: "/employee",
    icon: Users2,
    count: "6"
  },
  {
    title: "Users",
    path: "/users",
    icon: UserCog
  },
  {
    title: "Partner",
    path: "/partners",
    icon: Handshake
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileBarChart
  },
  {
    title: "Sports for all",
    path: "/sports-for-all",
    icon: Trophy
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`
      bg-white border-r h-screen sticky top-0 overflow-y-auto
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <img src="/logo/logo.svg" alt="Logo" className="h-8" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-sm
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {!collapsed && (
                <>
                  <span className="flex-1">{link.title}</span>
                  {link.count && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      link.badge || 'bg-gray-100'
                    }`}>
                      {link.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  Flag,
  Award,
  Users,
  GraduationCap,
  School,
  Building2,
  Plane,
  FileText,
  Briefcase,
  Calendar,
  CircleUser,
  UsersRound,
  BarChart3,
  Trophy,
  Settings,
  Moon,
  Sun,
  Search,
  Bell,
  Menu,
  X,
  Timer,
  Radio
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
    { 
      icon: Timer, 
      label: 'Match Operator', 
      path: '/match-operator',
      badge: {
        text: 'LIVE',
        color: 'bg-red-500 text-white'
      }
    },
    { icon: Radio, label: 'Live Matches', path: '/match-operator/matches' },
    { icon: Flag, label: 'National Teams', path: '/national-teams' },
    { icon: Award, label: 'Federations', path: '/federations' },
    { icon: Users, label: 'Sports professionals', path: '/sports-professionals' },
    { icon: GraduationCap, label: 'Trainings', path: '/trainings' },
    { icon: School, label: 'Isonga Programs', path: '/isonga-programs' },
    { icon: School, label: 'Academies', path: '/academies' },
    { icon: Building2, label: 'Infrastructure', path: '/infrastructure' },
    { icon: Plane, label: 'Sports tourism', path: '/sports-tourism' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Briefcase, label: 'Contracts', path: '/contracts' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: CircleUser, label: 'Employee', path: '/employee' },
    { icon: UsersRound, label: 'Users', path: '/users' },
    { icon: Users, label: 'Partners', path: '/partners' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Trophy, label: 'Sports for all', path: '/sports-for-all' }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen w-64 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className={`flex flex-col h-full ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-r`}>
        {/* Logo */}
        <div className={`flex items-center justify-center h-16 px-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <img src="/logo/logo.svg" alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded-full ${item.badge.color}`}>
                      {item.badge.text}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Settings and Dark Mode */}
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t space-y-2`}>
          <Link
            to="/settings"
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm">Settings</span>
          </Link>
          <button
            onClick={toggleDarkMode}
            className={`flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="text-sm">Dark Mode</span>
            <div className={`ml-auto w-10 h-5 rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 
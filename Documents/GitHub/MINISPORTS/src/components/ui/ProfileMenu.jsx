import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Settings,
  LogOut,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { toast } from 'sonner';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const loadingToast = toast.loading('Logging out...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
      setTimeout(() => {
        toast.dismiss();
        navigate('/landing');
      }, 500);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const confirmLogout = () => {
    toast.custom((t) => (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}>
        <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Confirm Logout
        </h3>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t)}
            className={`px-3 py-1 rounded-md text-sm ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              handleLogout();
            }}
            className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };

  return (
    <div className="flex items-center" ref={menuRef}>
      {/* Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img 
              src="/profile/profile-pic.png"
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              NTARINDWA
            </span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </button>

        {isOpen && (
          <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-2">
              <Link
                to="/settings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </div>

            <div className={`p-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-red-400' 
                    : 'hover:bg-gray-100 text-red-600'
                } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu; 
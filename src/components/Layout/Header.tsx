import React from 'react';
import { Moon, Sun, Bell, Settings, User } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
            Manage and track student progress efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500 transition-colors duration-200" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 transition-colors duration-200" />
            )}
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 relative">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors duration-200" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors duration-200" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
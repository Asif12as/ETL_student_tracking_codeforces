import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Analytics from './pages/Analytics';
import Activity from './pages/Activity';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'dark' : ''} transition-colors duration-200`}>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route path="/" element={
                <>
                  <Header title="Dashboard" />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Dashboard />
                  </main>
                </>
              } />
              <Route path="/students" element={
                <>
                  <Header title="Students" />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Students />
                  </main>
                </>
              } />
              <Route path="/analytics" element={
                <>
                  <Header title="Analytics" />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Analytics />
                  </main>
                </>
              } />
              <Route path="/activity" element={
                <>
                  <Header title="Activity" />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Activity />
                  </main>
                </>
              } />
              <Route path="/notifications" element={
                <>
                  <Header title="Notifications" />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Notifications />
                  </main>
                </>
              } />
              <Route path="/settings" element={
                <>
                  <Header title="Settings" />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Settings />
                  </main>
                </>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            className: isDark ? 'dark:bg-gray-800 dark:text-white' : '',
            duration: 4000,
            style: {
              background: isDark ? '#1F2937' : '#FFFFFF',
              color: isDark ? '#F9FAFB' : '#111827',
              border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
            },
          }}
        />
      </Router>
    </div>
  );
}

export default App;
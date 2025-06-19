import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Database, 
  Mail, 
  Clock, 
  Shield,
  Save,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'CodeTracker',
    adminEmail: 'admin@codetracker.com',
    timezone: 'UTC',
    
    // Notification Settings
    emailNotifications: true,
    inactiveStudentReminders: true,
    contestReminders: true,
    achievementNotifications: true,
    reminderInterval: 7,
    
    // Sync Settings
    codeforcesApiSync: true,
    syncInterval: 24,
    avoidPeakHours: true,
    peakHoursStart: '10:00',
    peakHoursEnd: '14:00',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFrom: 'noreply@codetracker.com',
    
    // Security Settings
    sessionTimeout: 60,
    requireStrongPasswords: true,
    twoFactorAuth: false
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Settings saved successfully!');
  };

  const handleSyncNow = async () => {
    setIsLoading(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast.success('Codeforces data synchronized successfully!');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Configure your CodeTracker instance
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        {renderSection(
          'General Settings',
          <SettingsIcon className="h-5 w-5 text-blue-500" />,
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {renderSection(
          'Notification Settings',
          <Bell className="h-5 w-5 text-green-500" />,
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'inactiveStudentReminders', label: 'Inactive Student Reminders' },
              { key: 'contestReminders', label: 'Contest Reminders' },
              { key: 'achievementNotifications', label: 'Achievement Notifications' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <button
                  onClick={() => updateSetting(key, !settings[key as keyof typeof settings])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings[key as keyof typeof settings] ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reminder Interval (days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.reminderInterval}
                onChange={(e) => updateSetting('reminderInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Sync Settings */}
        {renderSection(
          'Codeforces Sync Settings',
          <Database className="h-5 w-5 text-purple-500" />,
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Auto Sync</span>
              <button
                onClick={() => updateSetting('codeforcesApiSync', !settings.codeforcesApiSync)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.codeforcesApiSync ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.codeforcesApiSync ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sync Interval (hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.syncInterval}
                onChange={(e) => updateSetting('syncInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avoid Peak Hours</span>
              <button
                onClick={() => updateSetting('avoidPeakHours', !settings.avoidPeakHours)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.avoidPeakHours ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.avoidPeakHours ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {settings.avoidPeakHours && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peak Hours Start
                  </label>
                  <input
                    type="time"
                    value={settings.peakHoursStart}
                    onChange={(e) => updateSetting('peakHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peak Hours End
                  </label>
                  <input
                    type="time"
                    value={settings.peakHoursEnd}
                    onChange={(e) => updateSetting('peakHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={handleSyncNow}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 disabled:bg-purple-25 border border-purple-200 rounded-lg transition-colors"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Now
            </button>
          </div>
        )}

        {/* Email Settings */}
        {renderSection(
          'Email Configuration',
          <Mail className="h-5 w-5 text-yellow-500" />,
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => updateSetting('smtpHost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Username
              </label>
              <input
                type="text"
                value={settings.smtpUsername}
                onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Password
              </label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Email Address
              </label>
              <input
                type="email"
                value={settings.emailFrom}
                onChange={(e) => updateSetting('emailFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Security Settings */}
        {renderSection(
          'Security Settings',
          <Shield className="h-5 w-5 text-red-500" />,
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Strong Passwords</span>
              <button
                onClick={() => updateSetting('requireStrongPasswords', !settings.requireStrongPasswords)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.requireStrongPasswords ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.requireStrongPasswords ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
              <button
                onClick={() => updateSetting('twoFactorAuth', !settings.twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactorAuth ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
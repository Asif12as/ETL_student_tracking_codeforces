import React, { useState } from 'react';
import { Mail, Bell, Send, Users, CheckCircle, AlertCircle, Clock, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { useStudents } from '../hooks/useStudents';
import { toast } from 'react-hot-toast';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'history'>('overview');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  
  const { students } = useStudents();
  const inactiveStudents = students.filter(s => !s.isActive);

  // Mock notification history
  const notificationHistory = [
    {
      id: 1,
      type: 'inactive_reminder',
      subject: 'Time to get back to coding!',
      recipients: inactiveStudents.length,
      sentAt: subDays(new Date(), 1),
      status: 'sent',
      openRate: 67
    },
    {
      id: 2,
      type: 'contest_reminder',
      subject: 'Upcoming Contest Tomorrow',
      recipients: students.length,
      sentAt: subDays(new Date(), 3),
      status: 'sent',
      openRate: 85
    }
  ];

  const handleSendEmail = () => {
    if (!emailSubject || !emailContent || selectedStudents.length === 0) {
      toast.error('Please fill all fields and select at least one student');
      return;
    }
    
    toast.success(`Email sent to ${selectedStudents.length} students successfully!`);
    setEmailSubject('');
    setEmailContent('');
    setSelectedStudents([]);
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Show empty state if no students
  if (students.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header with Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage student communication and engagement
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            No Students to Notify
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Add students to start sending notifications, reminders, and updates about their coding progress.
          </p>
          <Link
            to="/students"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Students to Send Notifications
          </Link>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Students</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{inactiveStudents.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{students.length}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Enabled</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                {students.filter(s => s.emailNotifications).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {students.filter(s => s.isActive).length}
              </p>
            </div>
            <Bell className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Inactive Students Alert */}
      {inactiveStudents.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                {inactiveStudents.length} Inactive Students Need Attention
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                These students haven't submitted any solutions in the last 7 days. Consider sending them a reminder.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {inactiveStudents.slice(0, 5).map(student => (
                  <div key={student._id} className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                    <img src={student.avatar} alt={student.name} className="h-6 w-6 rounded-full" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</span>
                  </div>
                ))}
                {inactiveStudents.length > 5 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      +{inactiveStudents.length - 5} more
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveTab('send')}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSendEmail = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compose Email</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Content
            </label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Student Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Recipients</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedStudents.length} selected
          </span>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {students.map(student => (
            <div
              key={student._id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedStudents.includes(student._id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleStudentSelection(student._id)}
            >
              <div className="flex items-center space-x-3">
                <img src={student.avatar} alt={student.name} className="h-8 w-8 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                </div>
              </div>
              <div className={`h-5 w-5 rounded border-2 ${
                selectedStudents.includes(student._id)
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {selectedStudents.includes(student._id) && (
                  <CheckCircle className="h-3 w-3 text-white m-0.5" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSendEmail}
            disabled={selectedStudents.length === 0 || !emailSubject || !emailContent}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Email History</h3>
      
      <div className="space-y-4">
        {notificationHistory.map(notification => (
          <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {notification.subject}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Sent to {notification.recipients} students • {format(notification.sentAt, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.openRate}% opened
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                {notification.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage student communication and engagement
          </p>
        </div>
        
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Bell },
              { id: 'send', label: 'Send Email', icon: Send },
              { id: 'history', label: 'History', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'send' && renderSendEmail()}
      {activeTab === 'history' && renderHistory()}
    </div>
  );
};

export default Notifications;
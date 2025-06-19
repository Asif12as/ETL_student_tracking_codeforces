import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Code, Trophy, Filter, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, isAfter } from 'date-fns';
import { useStudents } from '../hooks/useStudents';

const Activity: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState(7);
  const [activityFilter, setActivityFilter] = useState<'all' | 'submissions' | 'contests'>('all');
  const { students } = useStudents();
  
  // Generate activity feed from real student data
  const generateActivityFeed = () => {
    const activities: any[] = [];
    
    // For now, we'll show basic student registration activities
    // In a real implementation, this would come from the database
    students.forEach(student => {
      if (isAfter(new Date(student.joinDate), subDays(new Date(), timeFilter))) {
        activities.push({
          id: `registration-${student._id}`,
          type: 'registration',
          student,
          timestamp: new Date(student.joinDate),
          description: `Joined CodeTracker`,
          details: `Codeforces handle: ${student.codeforcesHandle}`
        });
      }

      // Add sync activities
      if (student.lastSyncTime && isAfter(new Date(student.lastSyncTime), subDays(new Date(), timeFilter))) {
        activities.push({
          id: `sync-${student._id}`,
          type: 'sync',
          student,
          timestamp: new Date(student.lastSyncTime),
          description: `Data synchronized`,
          details: `Status: ${student.syncStatus}`
        });
      }
    });
    
    return activities
      .filter(activity => {
        if (activityFilter === 'all') return true;
        return activity.type === activityFilter;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const activities = generateActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contest':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'submission':
        return <Code className="h-5 w-5 text-blue-500" />;
      case 'registration':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'sync':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contest':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'submission':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'registration':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'sync':
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  // Show empty state if no students
  if (students.length === 0) {
    return (
      <div className="space-y-6">
        {/* Activity Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Real-time updates on student coding activities and achievements
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
            <Calendar className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            No Activity Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Add students to start tracking their coding activities, contest participation, and problem-solving progress.
          </p>
          <Link
            to="/students"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Students to See Activity
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Real-time updates on student coding activities and achievements
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as 'all' | 'submissions' | 'contests')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Activities</option>
              <option value="submissions">Submissions Only</option>
              <option value="contests">Contests Only</option>
            </select>
            
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{activities.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Registrations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {activities.filter(a => a.type === 'registration').length}
              </p>
            </div>
            <Code className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sync Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {activities.filter(a => a.type === 'sync').length}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {new Set(activities.map(a => a.student._id)).size}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        
        <div className="p-6">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your time filter to see more activities, or add more students.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 ${getActivityColor(activity.type)}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={activity.student.avatar}
                          alt={activity.student.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {activity.student.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(activity.timestamp, 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {activity.description}
                    </p>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
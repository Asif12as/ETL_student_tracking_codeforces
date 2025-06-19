import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp, Target, Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/Dashboard/StatsCard';
import ActivityChart from '../components/Dashboard/ActivityChart';
import { useStudents } from '../hooks/useStudents';
import { analyticsAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const { students } = useStudents();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to local data calculation
        const activeStudents = students.filter(s => s.isActive);
        const inactiveStudents = students.filter(s => !s.isActive);
        const averageRating = students.length > 0 
          ? Math.round(students.reduce((sum, s) => sum + s.currentRating, 0) / students.length)
          : 0;

        setDashboardData({
          stats: {
            totalStudents: students.length,
            activeStudents: activeStudents.length,
            inactiveStudents: inactiveStudents.length,
            averageRating,
            recentActivity: 0
          },
          weeklyActivity: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [students]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const weeklyActivity = dashboardData?.weeklyActivity || [];

  // Show empty state if no students
  if (stats.totalStudents === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to CodeTracker!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Get started by adding your first student. Once you add students, their Codeforces data will be automatically synced and you'll see comprehensive analytics here.
          </p>
          <Link
            to="/students"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Student
          </Link>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 opacity-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Analytics</h3>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Track rating changes, contest performance, and problem-solving progress for each student.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 opacity-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Monitoring</h3>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Monitor daily submission activity and identify students who need encouragement.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 opacity-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Automated Sync</h3>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Automatically sync contest results and problem solutions from Codeforces API.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents || 0}
          change={{ value: 12, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Students"
          value={stats.activeStudents || 0}
          change={{ value: 8, type: 'increase' }}
          icon={UserCheck}
          color="green"
        />
        <StatsCard
          title="Inactive Students"
          value={stats.inactiveStudents || 0}
          change={{ value: 4, type: 'decrease' }}
          icon={UserX}
          color="red"
        />
        <StatsCard
          title="Average Rating"
          value={stats.averageRating || 0}
          change={{ value: 5.2, type: 'increase' }}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Recent Activity"
          value={stats.recentActivity || 0}
          change={{ value: 15, type: 'increase' }}
          icon={Activity}
          color="yellow"
        />
        <StatsCard
          title="Weekly Goal"
          value="85%"
          change={{ value: 10, type: 'increase' }}
          icon={Target}
          color="blue"
        />
      </div>

      {/* Activity Charts - Only show if we have data */}
      {weeklyActivity.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart 
            title="Weekly Activity Overview"
            data={weeklyActivity}
            type="overview"
          />
          <ActivityChart 
            title="Student Engagement Trends"
            data={weeklyActivity}
            type="engagement"
          />
        </div>
      )}

      {/* Recent Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Students</h2>
          <Link 
            to="/students"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            View All Students
          </Link>
        </div>
        
        <div className="space-y-4">
          {students.slice(0, 5).map((student) => (
            <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {student.codeforcesHandle}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {student.currentRating}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student.isActive 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
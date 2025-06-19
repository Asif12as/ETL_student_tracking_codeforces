import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Award, Calendar, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { useStudents } from '../hooks/useStudents';
import { analyticsAPI } from '../services/api';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const { students } = useStudents();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [dashboardResponse, ratingResponse, trendsResponse] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getRatingDistribution(),
          analyticsAPI.getPerformanceTrends(12)
        ]);

        setAnalyticsData({
          dashboard: dashboardResponse.data,
          ratingDistribution: ratingResponse.data,
          performanceTrends: trendsResponse.data
        });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        // Fallback to basic calculations
        setAnalyticsData({
          dashboard: {
            stats: {
              totalStudents: students.length,
              activeStudents: students.filter(s => s.isActive).length,
              averageRating: students.length > 0 
                ? Math.round(students.reduce((sum, s) => sum + s.currentRating, 0) / students.length)
                : 0
            }
          },
          ratingDistribution: [],
          performanceTrends: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [students, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show empty state if no students
  if (students.length === 0) {
    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Comprehensive insights into student coding performance and progress
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            No Analytics Data Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Add students to see detailed analytics including rating trends, problem-solving patterns, and performance insights.
          </p>
          <Link
            to="/students"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Students to View Analytics
          </Link>
        </div>
      </div>
    );
  }

  const stats = analyticsData?.dashboard?.stats || {};
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Comprehensive insights into student coding performance and progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.averageRating || 0}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">Based on {students.length} students</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {students.length > 0 ? Math.round((students.filter(s => s.isActive).length / students.length) * 100) : 0}%
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{students.filter(s => s.isActive).length} active students</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{students.length}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Registered students</p>
            </div>
            <Target className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sync Status</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {students.filter(s => s.syncStatus === 'success').length}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Successfully synced</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Student Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Status Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: students.filter(s => s.isActive).length },
                    { name: 'Inactive', value: students.filter(s => !s.isActive).length }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[{ name: 'Active' }, { name: 'Inactive' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900 dark:text-white">Active Students</span>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {students.filter(s => s.isActive).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900 dark:text-white">Inactive Students</span>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {students.filter(s => !s.isActive).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Overview</h3>
          <Link 
            to="/students"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            View All Students
          </Link>
        </div>
        <div className="space-y-3">
          {students.slice(0, 8).map((student) => (
            <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{student.codeforcesHandle}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">{student.currentRating}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
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

export default Analytics;
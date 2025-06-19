import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  ExternalLink, 
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Award,
  Clock,
  Filter,
  BarChart3,
  Zap
} from 'lucide-react';
import { Student, Contest, Problem, SubmissionActivity } from '../../types';
import { getRatingColor, getRatingTitle, FILTER_OPTIONS } from '../../utils/constants';
import { format, subDays, isAfter, startOfWeek, addDays, getDay, startOfYear, endOfYear, eachWeekOfInterval, eachDayOfInterval } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StudentProfileProps {
  student: Student;
  contests: Contest[];
  problems: Problem[];
  submissionActivity: SubmissionActivity[];
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  contests,
  problems,
  submissionActivity,
  onBack
}) => {
  const [contestFilter, setContestFilter] = useState(365);
  const [problemFilter, setProblemFilter] = useState(90);

  // Filter contests based on selected time period
  const filteredContests = contests.filter(contest =>
    isAfter(contest.date, subDays(new Date(), contestFilter))
  );

  // Filter problems based on selected time period
  const filteredProblems = problems.filter(problem =>
    isAfter(problem.solvedAt, subDays(new Date(), problemFilter))
  );

  // Calculate problem solving statistics
  const problemStats = {
    totalSolved: filteredProblems.length,
    averageRating: filteredProblems.length > 0 
      ? Math.round(filteredProblems.reduce((sum, p) => sum + p.rating, 0) / filteredProblems.length) 
      : 0,
    mostDifficultProblem: filteredProblems.reduce((max, p) => 
      p.rating > (max?.rating || 0) ? p : max, 
      filteredProblems[0] || null
    ),
    averageProblemsPerDay: filteredProblems.length > 0 
      ? Math.round((filteredProblems.length / problemFilter) * 10) / 10 
      : 0,
    ratingDistribution: filteredProblems.reduce((acc, problem) => {
      const bucket = Math.floor(problem.rating / 200) * 200;
      const range = `${bucket}-${bucket + 199}`;
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  // Convert rating distribution to chart data
  const ratingDistributionData = Object.entries(problemStats.ratingDistribution)
    .map(([range, count]) => ({ 
      range: range.replace('-', ' - '), 
      count,
      percentage: Math.round((count / filteredProblems.length) * 100) || 0
    }))
    .sort((a, b) => parseInt(a.range.split(' - ')[0]) - parseInt(b.range.split(' - ')[0]));

  // Calculate contest statistics
  const contestStats = {
    totalContests: filteredContests.length,
    totalRatingChange: filteredContests.reduce((sum, c) => sum + c.ratingChange, 0),
    averageRank: filteredContests.length > 0 
      ? Math.round(filteredContests.reduce((sum, c) => sum + c.rank, 0) / filteredContests.length) 
      : 0,
    totalProblemsSolved: filteredContests.reduce((sum, c) => sum + c.problemsSolved, 0),
    averageProblemsPerContest: filteredContests.length > 0 
      ? Math.round((filteredContests.reduce((sum, c) => sum + c.problemsSolved, 0) / filteredContests.length) * 10) / 10 
      : 0
  };

  // Get activity intensity for heatmap
  const getActivityIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    if (count <= 2) return 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800';
    if (count <= 4) return 'bg-green-300 dark:bg-green-700 border border-green-400 dark:border-green-600';
    if (count <= 6) return 'bg-green-400 dark:bg-green-600 border border-green-500 dark:border-green-500';
    return 'bg-green-500 dark:bg-green-500 border border-green-600 dark:border-green-400';
  };

  // Prepare contest data for rating graph
  const contestChartData = filteredContests
    .slice(-20) // Show last 20 contests for better readability
    .map(contest => ({
      ...contest,
      dateFormatted: format(contest.date, 'MMM dd'),
      ratingChangeFormatted: contest.ratingChange >= 0 ? `+${contest.ratingChange}` : `${contest.ratingChange}`
    }));

  // Generate heatmap data for the last year
  const generateHeatmapData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, 364); // 365 days total
    
    // Create a map of submission counts by date
    const submissionMap = submissionActivity.reduce((acc, activity) => {
      acc[activity.date] = activity.count;
      return acc;
    }, {} as { [key: string]: number });

    // Generate all weeks in the year
    const weeks = eachWeekOfInterval({
      start: startOfWeek(startDate, { weekStartsOn: 0 }), // Start on Sunday
      end: endDate
    });

    return weeks.map(weekStart => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(weekStart, i);
        const dateStr = format(day, 'yyyy-MM-dd');
        const count = submissionMap[dateStr] || 0;
        
        days.push({
          date: day,
          dateStr,
          count,
          dayOfWeek: getDay(day)
        });
      }
      return days;
    });
  };

  const heatmapWeeks = generateHeatmapData();

  // Generate month labels for the heatmap
  const generateMonthLabels = () => {
    const months = [];
    const startDate = subDays(new Date(), 364);
    
    for (let i = 0; i < 12; i++) {
      const monthDate = addDays(startDate, i * 30);
      months.push({
        name: format(monthDate, 'MMM'),
        position: i * 4.5 // Approximate position
      });
    }
    
    return months;
  };

  const monthLabels = generateMonthLabels();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Students
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <img
              src={student.avatar}
              alt={student.name}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-2" />
                  {student.email}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 mr-2" />
                  {student.phone}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {student.codeforcesHandle}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{student.currentRating}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Rating</div>
              <div
                className="inline-block px-2 py-1 rounded text-xs font-medium text-white mt-1"
                style={{ backgroundColor: getRatingColor(student.currentRating) }}
              >
                {getRatingTitle(student.currentRating)}
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{student.maxRating}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Max Rating</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{problems.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Problems Solved</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{contests.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Contests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contest History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-blue-500" />
            Contest History
          </h2>
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={contestFilter}
              onChange={(e) => setContestFilter(Number(e.target.value))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
            </select>
          </div>
        </div>

        {/* Contest Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{contestStats.totalContests}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Contests</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 text-center">
            <div className={`text-lg font-bold ${contestStats.totalRatingChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {contestStats.totalRatingChange >= 0 ? '+' : ''}{contestStats.totalRatingChange}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Rating Change</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{contestStats.averageRank}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Rank</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{contestStats.totalProblemsSolved}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Problems Solved</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{contestStats.averageProblemsPerContest}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Problems/Contest</div>
          </div>
        </div>

        {/* Rating Graph */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contestChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelFormatter={(date) => `Contest: ${date}`}
                formatter={(value, name) => [
                  name === 'rating' ? value : `${value >= 0 ? '+' : ''}${value}`,
                  name === 'rating' ? 'Rating' : 'Rating Change'
                ]}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Contest List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Contests</h3>
          {filteredContests.slice(0, 10).map((contest) => (
            <div key={contest.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {contest.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {format(contest.date, 'MMM dd, yyyy')} • Rank #{contest.rank} • {contest.problemsSolved} problems solved
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {contest.rating}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                </div>
                <div className={`text-sm font-bold px-2 py-1 rounded ${
                  contest.ratingChange >= 0 
                    ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' 
                    : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                }`}>
                  {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Solving Data Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="h-6 w-6 mr-3 text-green-500" />
            Problem Solving Data
          </h2>
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={problemFilter}
              onChange={(e) => setProblemFilter(Number(e.target.value))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Problem Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{problemStats.totalSolved}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Solved</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{problemStats.averageRating}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {problemStats.mostDifficultProblem?.rating || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Hardest Problem</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{problemStats.averageProblemsPerDay}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Problems/Day</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {problemStats.mostDifficultProblem?.name?.substring(0, 10) || 'N/A'}...
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Hardest Problem</div>
          </div>
        </div>

        {/* Rating Distribution Bar Chart */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Problems by Rating Range
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="range" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [
                    `${value} problems (${ratingDistributionData.find(d => d.count === value)?.percentage || 0}%)`,
                    'Count'
                  ]}
                />
                <Bar 
                  dataKey="count" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  stroke="#059669"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Submission Activity Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Activity className="h-6 w-6 mr-3 text-purple-500" />
          Submission Activity Heatmap
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {submissionActivity.reduce((sum, day) => sum + day.count, 0)} submissions in the last year
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700 border border-green-400 dark:border-green-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600 border border-green-500 dark:border-green-500"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500 border border-green-600 dark:border-green-400"></div>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs">More</span>
            </div>
          </div>

          {/* GitHub-style heatmap */}
          <div className="relative">
            {/* Month labels */}
            <div className="flex mb-2 ml-8">
              {monthLabels.map((month, index) => (
                <div 
                  key={month.name} 
                  className="text-xs text-gray-500 dark:text-gray-400 flex-1 text-left"
                  style={{ marginLeft: index === 0 ? '0' : '1rem' }}
                >
                  {month.name}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 mr-2 h-20">
                <div></div>
                <div>Mon</div>
                <div></div>
                <div>Wed</div>
                <div></div>
                <div>Fri</div>
                <div></div>
              </div>

              {/* Heatmap grid */}
              <div className="flex space-x-1">
                {heatmapWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${getActivityIntensity(day.count)} hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer`}
                        title={`${format(day.date, 'MMM dd, yyyy')}: ${day.count} submissions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Recent Contest Performance
          </h3>
          <div className="space-y-3">
            {contests.slice(0, 5).map((contest) => (
              <div key={contest.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {contest.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(contest.date, 'MMM dd, yyyy')} • Rank #{contest.rank}
                  </div>
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded ${
                  contest.ratingChange >= 0 
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                    : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                }`}>
                  {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Recent Problem Solutions
          </h3>
          <div className="space-y-3">
            {problems.slice(0, 5).map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {problem.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(problem.solvedAt, 'MMM dd, yyyy')} • {problem.tags.join(', ')}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getRatingColor(problem.rating) }}
                  >
                    {problem.rating}
                  </span>
                  <span className={`text-xs font-bold ${
                    problem.verdict === 'OK' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {problem.verdict === 'OK' ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
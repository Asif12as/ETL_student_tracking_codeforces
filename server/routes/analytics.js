import express from 'express';
import Student from '../models/Student.js';
import Contest from '../models/Contest.js';
import Problem from '../models/Problem.js';
import SubmissionActivity from '../models/SubmissionActivity.js';
import { subDays, format } from 'date-fns';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ isActive: true });
    const inactiveStudents = totalStudents - activeStudents;

    // Calculate average rating
    const ratingAgg = await Student.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$currentRating' } } }
    ]);
    const averageRating = Math.round(ratingAgg[0]?.avgRating || 0);

    // Recent activity (last 7 days)
    const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const recentActivity = await SubmissionActivity.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, totalSubmissions: { $sum: '$count' } } }
    ]);

    // Weekly activity data
    const weeklyActivity = await SubmissionActivity.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: '$date',
          submissions: { $sum: '$count' },
          problems: { $sum: '$acceptedCount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      stats: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        averageRating,
        recentActivity: recentActivity[0]?.totalSubmissions || 0
      },
      weeklyActivity: weeklyActivity.map(day => ({
        date: format(new Date(day._id), 'MMM dd'),
        submissions: day.submissions,
        problems: day.problems,
        contests: Math.floor(Math.random() * 5) // Placeholder
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rating distribution
router.get('/rating-distribution', async (req, res) => {
  try {
    const distribution = await Student.aggregate([
      {
        $bucket: {
          groupBy: '$currentRating',
          boundaries: [0, 1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000, 4000],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            students: { $push: '$name' }
          }
        }
      }
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance trends
router.get('/performance-trends', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    
    const trends = await Student.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$lastSubmission' },
            year: { $year: '$lastSubmission' }
          },
          averageRating: { $avg: '$currentRating' },
          activeStudents: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalStudents: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: parseInt(months) }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
import axios from 'axios';
import Student from '../models/Student.js';
import Contest from '../models/Contest.js';
import Problem from '../models/Problem.js';
import SubmissionActivity from '../models/SubmissionActivity.js';
import { format, parseISO } from 'date-fns';

const CODEFORCES_API_BASE = 'https://codeforces.com/api';

// Rate limiting: Codeforces allows 5 requests per second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CodeforcesService {
  static async getUserInfo(handle) {
    try {
      await delay(200); // Rate limiting
      const response = await axios.get(`${CODEFORCES_API_BASE}/user.info`, {
        params: { handles: handle },
        timeout: 10000
      });
      
      if (response.data.status === 'OK' && response.data.result.length > 0) {
        return response.data.result[0];
      }
      throw new Error('User not found');
    } catch (error) {
      console.error(`Error fetching user info for ${handle}:`, error.message);
      throw error;
    }
  }

  static async getUserRating(handle) {
    try {
      await delay(200);
      const response = await axios.get(`${CODEFORCES_API_BASE}/user.rating`, {
        params: { handle },
        timeout: 10000
      });
      
      if (response.data.status === 'OK') {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching rating for ${handle}:`, error.message);
      return [];
    }
  }

  static async getUserSubmissions(handle, from = 1, count = 100000) {
    try {
      await delay(200);
      const response = await axios.get(`${CODEFORCES_API_BASE}/user.status`, {
        params: { handle, from, count },
        timeout: 15000
      });
      
      if (response.data.status === 'OK') {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching submissions for ${handle}:`, error.message);
      return [];
    }
  }

  static async syncStudentData(studentId) {
    try {
      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      console.log(`🔄 Syncing data for ${student.codeforcesHandle}...`);
      
      // Update sync status
      await Student.findByIdAndUpdate(studentId, {
        syncStatus: 'syncing',
        syncError: null
      });

      // 1. Fetch user info
      const userInfo = await this.getUserInfo(student.codeforcesHandle);
      
      // 2. Fetch rating history
      const ratingHistory = await this.getUserRating(student.codeforcesHandle);
      
      // 3. Fetch submissions
      const submissions = await this.getUserSubmissions(student.codeforcesHandle);

      // 4. Update student data
      await this.updateStudentInfo(student, userInfo, ratingHistory, submissions);
      
      // 5. Update contests
      await this.updateContests(student, ratingHistory);
      
      // 6. Update problems
      await this.updateProblems(student, submissions);
      
      // 7. Update submission activity
      await this.updateSubmissionActivity(student, submissions);

      // Update sync status
      await Student.findByIdAndUpdate(studentId, {
        syncStatus: 'success',
        lastSyncTime: new Date(),
        syncError: null
      });

      console.log(`✅ Successfully synced data for ${student.codeforcesHandle}`);
      return { success: true, message: 'Data synced successfully' };

    } catch (error) {
      console.error(`❌ Error syncing student ${studentId}:`, error.message);
      
      await Student.findByIdAndUpdate(studentId, {
        syncStatus: 'error',
        syncError: error.message
      });

      throw error;
    }
  }

  static async updateStudentInfo(student, userInfo, ratingHistory, submissions) {
    const currentRating = userInfo.rating || 0;
    const maxRating = userInfo.maxRating || currentRating;
    
    // Find last submission time
    let lastSubmission = null;
    if (submissions.length > 0) {
      const sortedSubmissions = submissions.sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds);
      lastSubmission = new Date(sortedSubmissions[0].creationTimeSeconds * 1000);
    }

    // Determine if student is active (submitted in last 7 days)
    const isActive = lastSubmission && 
      (new Date() - lastSubmission) < (7 * 24 * 60 * 60 * 1000);

    await Student.findByIdAndUpdate(student._id, {
      currentRating,
      maxRating,
      lastSubmission,
      isActive,
      codeforcesData: {
        rank: userInfo.rank,
        maxRank: userInfo.maxRank,
        contribution: userInfo.contribution || 0,
        organization: userInfo.organization || '',
        country: userInfo.country || '',
        city: userInfo.city || '',
        lastOnlineTime: userInfo.lastOnlineTimeSeconds ? 
          new Date(userInfo.lastOnlineTimeSeconds * 1000) : null,
        registrationTime: userInfo.registrationTimeSeconds ? 
          new Date(userInfo.registrationTimeSeconds * 1000) : null
      }
    });
  }

  static async updateContests(student, ratingHistory) {
    for (const contest of ratingHistory) {
      try {
        await Contest.findOneAndUpdate(
          {
            studentId: student._id,
            contestId: contest.contestId
          },
          {
            studentId: student._id,
            codeforcesHandle: student.codeforcesHandle,
            contestId: contest.contestId,
            contestName: contest.contestName,
            handle: contest.handle,
            rank: contest.rank,
            oldRating: contest.oldRating,
            newRating: contest.newRating,
            ratingChange: contest.newRating - contest.oldRating,
            ratingUpdateTime: new Date(contest.ratingUpdateTimeSeconds * 1000),
            contestTime: new Date(contest.ratingUpdateTimeSeconds * 1000)
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error updating contest ${contest.contestId}:`, error.message);
      }
    }
  }

  static async updateProblems(student, submissions) {
    const acceptedSubmissions = submissions.filter(sub => sub.verdict === 'OK');
    
    // Group by problem to get unique problems solved
    const uniqueProblems = new Map();
    
    for (const submission of acceptedSubmissions) {
      const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
      
      if (!uniqueProblems.has(problemKey) || 
          submission.creationTimeSeconds < uniqueProblems.get(problemKey).creationTimeSeconds) {
        uniqueProblems.set(problemKey, submission);
      }
    }

    for (const submission of uniqueProblems.values()) {
      try {
        await Problem.findOneAndUpdate(
          {
            studentId: student._id,
            contestId: submission.problem.contestId,
            problemIndex: submission.problem.index
          },
          {
            studentId: student._id,
            codeforcesHandle: student.codeforcesHandle,
            contestId: submission.problem.contestId,
            problemIndex: submission.problem.index,
            problemName: submission.problem.name,
            problemRating: submission.problem.rating || null,
            problemTags: submission.problem.tags || [],
            verdict: submission.verdict,
            submissionTime: new Date(submission.creationTimeSeconds * 1000),
            submissionId: submission.id,
            programmingLanguage: submission.programmingLanguage,
            timeConsumedMillis: submission.timeConsumedMillis || 0,
            memoryConsumedBytes: submission.memoryConsumedBytes || 0
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        if (error.code !== 11000) { // Ignore duplicate key errors
          console.error(`Error updating problem ${submission.problem.name}:`, error.message);
        }
      }
    }
  }

  static async updateSubmissionActivity(student, submissions) {
    // Group submissions by date
    const activityMap = new Map();
    
    for (const submission of submissions) {
      const date = format(new Date(submission.creationTimeSeconds * 1000), 'yyyy-MM-dd');
      
      if (!activityMap.has(date)) {
        activityMap.set(date, {
          count: 0,
          acceptedCount: 0,
          wrongAnswerCount: 0,
          timeoutCount: 0,
          otherCount: 0
        });
      }
      
      const activity = activityMap.get(date);
      activity.count++;
      
      switch (submission.verdict) {
        case 'OK':
          activity.acceptedCount++;
          break;
        case 'WRONG_ANSWER':
          activity.wrongAnswerCount++;
          break;
        case 'TIME_LIMIT_EXCEEDED':
          activity.timeoutCount++;
          break;
        default:
          activity.otherCount++;
      }
    }

    // Update database
    for (const [date, activity] of activityMap) {
      try {
        await SubmissionActivity.findOneAndUpdate(
          {
            studentId: student._id,
            date
          },
          {
            studentId: student._id,
            codeforcesHandle: student.codeforcesHandle,
            date,
            ...activity
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error updating activity for ${date}:`, error.message);
      }
    }
  }

  static async syncAllStudentsData() {
    try {
      const students = await Student.find({ isActive: true });
      console.log(`🔄 Starting sync for ${students.length} active students...`);
      
      for (const student of students) {
        try {
          await this.syncStudentData(student._id);
          await delay(1000); // Rate limiting between students
        } catch (error) {
          console.error(`Failed to sync ${student.codeforcesHandle}:`, error.message);
          continue; // Continue with next student
        }
      }
      
      console.log('✅ Completed syncing all students');
    } catch (error) {
      console.error('❌ Error in bulk sync:', error.message);
      throw error;
    }
  }
}

export const {
  getUserInfo,
  getUserRating,
  getUserSubmissions,
  syncStudentData,
  syncAllStudentsData
} = CodeforcesService;
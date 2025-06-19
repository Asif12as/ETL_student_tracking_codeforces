export interface Student {
  id: string;
  _id?: string; // For MongoDB compatibility
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSubmission: Date | null;
  isActive: boolean;
  emailNotifications: boolean;
  lastEmailSent?: Date;
  joinDate: Date;
  avatar?: string;
  // MongoDB specific fields
  codeforcesData?: {
    rank?: string;
    maxRank?: string;
    contribution?: number;
    organization?: string;
    country?: string;
    city?: string;
    lastOnlineTime?: Date;
    registrationTime?: Date;
  };
  syncStatus?: 'pending' | 'syncing' | 'success' | 'error';
  syncError?: string;
  lastSyncTime?: Date;
}

export interface Contest {
  id: number;
  name: string;
  date: Date;
  rating: number;
  rank: number;
  ratingChange: number;
  problemsSolved: number;
}

export interface Problem {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  solvedAt: Date;
  submissionCount: number;
  verdict: 'OK' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR';
}

export interface SubmissionActivity {
  date: string;
  count: number;
}

export interface ProblemStats {
  totalSolved: number;
  averageRating: number;
  mostDifficultProblem: Problem;
  ratingDistribution: { [key: string]: number };
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  averageRating: number;
  totalProblems: number;
  recentActivity: number;
}
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSubmission: string | null;
  isActive: boolean;
  emailNotifications: boolean;
  lastEmailSent?: string;
  joinDate: string;
  avatar: string;
  codeforcesData?: {
    rank?: string;
    maxRank?: string;
    contribution?: number;
    organization?: string;
    country?: string;
    city?: string;
    lastOnlineTime?: string;
    registrationTime?: string;
  };
  syncStatus: 'pending' | 'syncing' | 'success' | 'error';
  syncError?: string;
  lastSyncTime?: string;
}

export interface Contest {
  _id: string;
  studentId: string;
  contestId: number;
  contestName: string;
  rank: number;
  oldRating: number;
  newRating: number;
  ratingChange: number;
  ratingUpdateTime: string;
  contestTime: string;
  problemsSolved: number;
}

export interface Problem {
  _id: string;
  studentId: string;
  contestId: number;
  problemIndex: string;
  problemName: string;
  problemRating?: number;
  problemTags: string[];
  verdict: string;
  submissionTime: string;
  submissionId: number;
  programmingLanguage: string;
}

export interface SubmissionActivity {
  _id: string;
  studentId: string;
  date: string;
  count: number;
  acceptedCount: number;
  wrongAnswerCount: number;
  timeoutCount: number;
  otherCount: number;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  averageRating: number;
  recentActivity: number;
}

// Student API
export const studentAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get('/students', { params }),
  
  getById: (id: string) =>
    api.get(`/students/${id}`),
  
  create: (data: Partial<Student>) =>
    api.post('/students', data),
  
  update: (id: string, data: Partial<Student>) =>
    api.put(`/students/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/students/${id}`),
  
  sync: (id: string) =>
    api.post(`/students/${id}/sync`)
};

// Codeforces API
export const codeforcesAPI = {
  verifyHandle: (handle: string) =>
    api.get(`/codeforces/verify/${handle}`),
  
  syncAll: () =>
    api.post('/codeforces/sync-all')
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () =>
    api.get('/analytics/dashboard'),
  
  getRatingDistribution: () =>
    api.get('/analytics/rating-distribution'),
  
  getPerformanceTrends: (months?: number) =>
    api.get('/analytics/performance-trends', { params: { months } })
};

export default api;
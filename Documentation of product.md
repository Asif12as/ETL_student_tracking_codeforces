# Student Progress Management System - Technical Documentation

## Table of Contents

1. [Product Overview](#product-overview)
2. [System Architecture](#system-architecture)
3. [Data Models](#data-models)
4. [API Reference](#api-reference)
5. [Frontend Components](#frontend-components)
6. [Integration with Codeforces](#integration-with-codeforces)
7. [Scheduled Tasks](#scheduled-tasks)
8. [Development Guidelines](#development-guidelines)

## Product Overview

The Student Progress Management System is a comprehensive web application designed to track and analyze student progress in competitive programming through Codeforces integration. The system helps educators monitor student performance, track problem-solving activities, and analyze trends over time.

### Key Features

- **Dashboard**: Overview of key metrics including active students, average ratings, and recent activity
- **Student Management**: Add, edit, and track individual student profiles
- **Codeforces Integration**: Automatic synchronization with Codeforces API to fetch student data
- **Analytics**: Visualize performance trends, rating distributions, and problem-solving statistics
- **Activity Tracking**: Monitor submission activities and contest participation
- **Dark/Light Mode**: Fully responsive UI with theme support
- **Notifications**: Stay updated with important student activities

## System Architecture

The application follows a client-server architecture with the following components:

### Frontend

- **Technology**: React with TypeScript
- **State Management**: React Hooks
- **Routing**: React Router
- **API Communication**: Axios
- **UI Framework**: Tailwind CSS
- **Build Tool**: Vite

### Backend

- **Technology**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Scheduled Tasks**: Node-cron
- **External API**: Codeforces API

## Data Models

### Student

```typescript
interface Student {
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
```

### Contest

```typescript
interface Contest {
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
```

### Problem

```typescript
interface Problem {
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
```

### SubmissionActivity

```typescript
interface SubmissionActivity {
  _id: string;
  studentId: string;
  date: string;
  count: number;
  acceptedCount: number;
  wrongAnswerCount: number;
  timeoutCount: number;
  otherCount: number;
}
```

### DashboardStats

```typescript
interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  averageRating: number;
  recentActivity: number;
}
```

## API Reference

### Base URL

```
http://localhost:5000/api
```

### Authentication

Currently, the API does not implement authentication. This is planned for future releases.

### Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses include a JSON object with an `error` field containing the error message.

### Student API

#### Get All Students

```
GET /students
```

**Query Parameters:**

- `page`, `limit`, `search`, `status`

**Response:** JSON with pagination and student list

#### Get Student by ID

```
GET /students/:id
```

**Response:** Full student profile and data

#### Create Student

```
POST /students
```

**Request Body:** Student details

#### Update Student

```
PUT /students/:id
```

**Request Body:** Fields to update

#### Delete Student

```
DELETE /students/:id
```

**Response:** Deletion message

#### Sync Student Data

```
POST /students/:id/sync
```

**Response:** Sync status

### Codeforces API

#### Verify Codeforces Handle

```
GET /codeforces/verify/:handle
```

#### Sync All Students Data

```
POST /codeforces/sync-all
```

### Analytics API

#### Get Dashboard Statistics

```
GET /analytics/dashboard
```

#### Get Rating Distribution

```
GET /analytics/rating-distribution
```

#### Get Performance Trends

```
GET /analytics/performance-trends?months=6
```

## Frontend Components

### Layout Components

- Header, Sidebar, Layout

### Page Components

- Dashboard, Students, Analytics, Activity, Notifications, Settings

### Custom Hooks

- useStudents, useTheme

## Integration with Codeforces

Handled by `codeforcesService.js` using the following endpoints:

- `user.info`
- `user.rating`
- `user.status`

Implements rate limiting (5 req/sec).

## Scheduled Tasks

Using `node-cron`:

- **Every 6 hours**: `syncAllStudentsData()` updates ratings, contests, submissions

## Development Guidelines

### Environment Setup

1. Clone the repo
2. `npm install`
3. Setup `.env`
4. Start servers: `npm run dev` & `npm run server`

### Code Style

- Follow ESLint
- TypeScript
- Modular component structure

### Adding New Features

- Add components, update services/routes/models
- Document changes

### Testing

Planned in future

### Deployment

1. `npm run build`
2. `npm run preview`
3. Use PM2 for production

---

This documentation is maintained by Md Ashif 


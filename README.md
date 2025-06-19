# Student Progress Management System

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0.0-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)](https://vitejs.dev/)

A comprehensive web application for tracking and analyzing student progress in competitive programming through Codeforces integration. This system helps educators monitor student performance, track problem-solving activities, and analyze trends over time.

## DEMO LINK 
https://drive.google.com/file/d/1HMfmQUQESoTkwklBQrCrSewdkRQKy1LL/view?usp=sharing

## Features

- **Dashboard**: Overview of key metrics including active students, average ratings, and recent activity
- **Student Management**: Add, edit, and track individual student profiles
- **Codeforces Integration**: Automatic synchronization with Codeforces API to fetch student data
- **Analytics**: Visualize performance trends, rating distributions, and problem-solving statistics
- **Activity Tracking**: Monitor submission activities and contest participation
- **Dark/Light Mode**: Fully responsive UI with theme support
- **Notifications**: Stay updated with important student activities

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Recharts for data visualization
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- Axios for API requests

### Backend
- Express.js server
- MongoDB with Mongoose ODM
- Node-cron for scheduled tasks
- Codeforces API integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Codeforces API access

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd student-progress-management-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your MongoDB connection string and other configurations.

## Running the Application

### Development Mode

1. Start the backend server
   ```bash
   npm run server
   ```

2. Start the frontend development server
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

### Production Build

1. Build the frontend
   ```bash
   npm run build
   ```

2. Serve the production build
   ```bash
   npm run preview
   ```

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student
- `POST /api/students/:id/sync` - Sync student data with Codeforces

### Codeforces
- `GET /api/codeforces/verify/:handle` - Verify a Codeforces handle
- `POST /api/codeforces/sync-all` - Sync all students' data

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/rating-distribution` - Get rating distribution data
- `GET /api/analytics/performance-trends` - Get performance trends

## Scheduled Tasks

The application automatically syncs student data with Codeforces every 6 hours using node-cron.

## Project Structure

```
├── server/                 # Backend code
│   ├── index.js            # Server entry point
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── src/                    # Frontend code
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── .env.example           # Example environment variables
├── package.json           # Project dependencies
└── vite.config.ts         # Vite configuration
```

## License

MIT

## Acknowledgements

- [Codeforces API](https://codeforces.com/apiHelp) for providing the competitive programming data
- [Recharts](https://recharts.org/) for the charting library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) for the beautiful icon set

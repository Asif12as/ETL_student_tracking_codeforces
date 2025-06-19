import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import StudentTable from '../components/Students/StudentTable';
import StudentProfile from '../components/Students/StudentProfile';
import AddStudentModal from '../components/Students/AddStudentModal';
import { useStudents } from '../hooks/useStudents';
import { studentAPI } from '../services/api';

const Students: React.FC = () => {
  const { students, loading, createStudent, updateStudent, deleteStudent, syncStudent } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentDetailData, setStudentDetailData] = useState<{
    contests: any[];
    problems: any[];
    submissionActivity: any[];
  } | null>(null);

  const handleViewStudent = async (student: any) => {
    try {
      const response = await studentAPI.getById(student._id);
      setSelectedStudent(student);
      setStudentDetailData({
        contests: response.data.contests || [],
        problems: response.data.problems || [],
        submissionActivity: response.data.submissionActivity || []
      });
    } catch (error) {
      toast.error('Failed to load student details');
    }
  };

  const handleEditStudent = (student: any) => {
    // For now, just show a toast. You can implement edit functionality later
    toast.success('Edit functionality coming soon!');
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student? This will also delete all their contest and problem data.')) {
      try {
        await deleteStudent(studentId);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleAddStudentSubmit = async (studentData: {
    name: string;
    email: string;
    phone: string;
    codeforcesHandle: string;
  }) => {
    try {
      await createStudent(studentData);
      setIsAddModalOpen(false);
    } catch (error) {
      // Error is handled in the hook
      throw error; // Re-throw to prevent modal from closing
    }
  };

  const handleBack = () => {
    setSelectedStudent(null);
    setStudentDetailData(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedStudent && studentDetailData) {
    return (
      <StudentProfile
        student={{
          ...selectedStudent,
          id: selectedStudent._id,
          lastSubmission: selectedStudent.lastSubmission ? new Date(selectedStudent.lastSubmission) : new Date(),
          joinDate: new Date(selectedStudent.joinDate)
        }}
        contests={studentDetailData.contests.map(contest => ({
          ...contest,
          id: contest.contestId,
          name: contest.contestName,
          date: new Date(contest.contestTime),
          rating: contest.newRating,
          rank: contest.rank,
          ratingChange: contest.ratingChange,
          problemsSolved: contest.problemsSolved || 0
        }))}
        problems={studentDetailData.problems.map(problem => ({
          ...problem,
          id: problem._id,
          name: problem.problemName,
          rating: problem.problemRating || 0,
          tags: problem.problemTags || [],
          solvedAt: new Date(problem.submissionTime),
          submissionCount: 1,
          verdict: problem.verdict
        }))}
        submissionActivity={studentDetailData.submissionActivity.map(activity => ({
          date: activity.date,
          count: activity.count
        }))}
        onBack={handleBack}
      />
    );
  }

  return (
    <>
      <StudentTable
        students={students.map(student => ({
          ...student,
          id: student._id,
          lastSubmission: student.lastSubmission ? new Date(student.lastSubmission) : new Date(),
          joinDate: new Date(student.joinDate)
        }))}
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        onAddStudent={handleAddStudent}
      />
      
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStudentSubmit}
      />
    </>
  );
};

export default Students;
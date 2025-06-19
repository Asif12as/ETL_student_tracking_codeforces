import { useState, useEffect } from 'react';
import { studentAPI, Student } from '../services/api';
import { toast } from 'react-hot-toast';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (params?: any) => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll(params);
      setStudents(response.data.students);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch students');
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (data: Partial<Student>) => {
    try {
      const response = await studentAPI.create(data);
      setStudents(prev => [response.data, ...prev]);
      toast.success('Student created successfully');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create student';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    try {
      const response = await studentAPI.update(id, data);
      setStudents(prev => prev.map(s => s._id === id ? response.data : s));
      toast.success('Student updated successfully');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update student';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentAPI.delete(id);
      setStudents(prev => prev.filter(s => s._id !== id));
      toast.success('Student deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete student';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const syncStudent = async (id: string) => {
    try {
      await studentAPI.sync(id);
      toast.success('Student data sync started');
      // Refresh the student data
      fetchStudents();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to sync student data';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    syncStudent
  };
};
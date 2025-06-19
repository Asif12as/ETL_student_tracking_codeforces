import express from 'express';
import Student from '../models/Student.js';
import Contest from '../models/Contest.js';
import Problem from '../models/Problem.js';
import SubmissionActivity from '../models/SubmissionActivity.js';
import { syncStudentData } from '../services/codeforcesService.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { codeforcesHandle: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const students = await Student.find(query)
      .sort({ lastSubmission: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID with detailed data
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get contests
    const contests = await Contest.find({ studentId: req.params.id })
      .sort({ contestTime: -1 });

    // Get problems
    const problems = await Problem.find({ 
      studentId: req.params.id,
      verdict: 'OK'
    }).sort({ submissionTime: -1 });

    // Get submission activity
    const submissionActivity = await SubmissionActivity.find({ 
      studentId: req.params.id 
    }).sort({ date: 1 });

    res.json({
      student,
      contests,
      problems,
      submissionActivity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, codeforcesHandle } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [
        { email },
        { codeforcesHandle }
      ]
    });
    
    if (existingStudent) {
      return res.status(400).json({ 
        error: 'Student with this email or Codeforces handle already exists' 
      });
    }

    const student = new Student({
      name,
      email,
      phone,
      codeforcesHandle
    });

    await student.save();

    // Start initial sync in background
    syncStudentData(student._id).catch(error => {
      console.error(`Background sync failed for ${codeforcesHandle}:`, error.message);
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete related data
    await Promise.all([
      Contest.deleteMany({ studentId: req.params.id }),
      Problem.deleteMany({ studentId: req.params.id }),
      SubmissionActivity.deleteMany({ studentId: req.params.id })
    ]);
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync student data manually
router.post('/:id/sync', async (req, res) => {
  try {
    const result = await syncStudentData(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
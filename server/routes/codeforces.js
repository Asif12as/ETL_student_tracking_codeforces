import express from 'express';
import { getUserInfo, syncAllStudentsData } from '../services/codeforcesService.js';

const router = express.Router();

// Verify Codeforces handle
router.get('/verify/:handle', async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.params.handle);
    res.json({
      valid: true,
      userInfo: {
        handle: userInfo.handle,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        country: userInfo.country,
        city: userInfo.city,
        organization: userInfo.organization,
        rank: userInfo.rank,
        rating: userInfo.rating,
        maxRating: userInfo.maxRating
      }
    });
  } catch (error) {
    res.status(404).json({
      valid: false,
      error: 'Codeforces handle not found'
    });
  }
});

// Sync all students data
router.post('/sync-all', async (req, res) => {
  try {
    // Start sync in background
    syncAllStudentsData().catch(error => {
      console.error('Background sync failed:', error.message);
    });
    
    res.json({ 
      message: 'Sync started in background',
      status: 'started'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
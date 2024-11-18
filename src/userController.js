// userController.js
import express from 'express';
import { getUserDetails, authenticateJWT } from './authMiddleware.js';

const router = express.Router();

// Add the GET route for user data inside the controller
router.get('/', authenticateJWT, async (req, res) => {
    try {  
      const user = await getUserDetails(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
    //   console.log('Fetched User:', user); // Debug fetched user details
  
      res.json({
        username: user.username,
        email: user.email,
        role: user.role || 'Role not found', // Include role in the response
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;

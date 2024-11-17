// userController.js
import express from 'express';
import { getUserDetails } from './authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { userId } = req; // Get userId from the request object (set by authenticateJWT)
    const user = await getUserDetails(userId); // Fetch user details from the database

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching user data', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

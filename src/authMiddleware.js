// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from './db.js';

dotenv.config();

// Middleware to authenticate JWT
export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader); // Log the header

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Get the token from the header
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ message: 'Forbidden' });
      }
      console.log('Decoded Token:', user); // Log decoded token
      req.userId = user.id; // Attach the user ID from token to the request object
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    console.error('Authorization header missing');
    res.status(401).json({ message: 'Unauthorized' }); // Token is missing
  }
};

// Login route to authenticate and issue JWT
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user data from the database using email
    const [rows] = await connection.execute(
      'SELECT id_user, email, password, role FROM users WHERE email = ?',
      [email]
    );

    // Check if user exists
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Validate password (you would normally hash and compare it)
    if (user.password !== password) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token including the user ID
    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    // Send the token as a response
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// To fetch user details from the database (use this in your route handler)
export const getUserDetails = async (userId) => {
  console.log('User ID:', userId); // Log the userId

  if (!userId) {
    console.error('User ID is missing');
    return null; // If no userId is passed, return null
  }

  // Ensure the field matches the column name in your database
  const [rows] = await connection.execute(
    'SELECT username, email, role FROM users WHERE id_user = ?',
    [userId]
  );

  if (rows.length === 0) {
    console.error('User not found');
    return null; // Return null if no user found
  }

  return rows[0]; // Return user data if found
};

// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from './db.js';

dotenv.config();

// Middleware to authenticate JWT
export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Get the token from the header
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.userId = user.id; // Attach the user ID to the request object
      req.username = user.username; // Attach username to the request
      next();
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
      'SELECT id_user, username, email, password, role FROM users WHERE email = ?',
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

    // Generate a JWT token including the user ID, role, and username
    const token = jwt.sign(
      { id: user.id_user, username: user.username, role: user.role },
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
  // console.log('Fetched User:', rows[0]); // Debug fetched user details
  return rows[0]; // Return user data if found
};

// Middleware to authenticate role
export const authenticateRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.headers['userrole']; // Get the role from the header

    if (!userRole) {
      return res.status(401).json({ message: 'Role not provided' });
    }

    // Check if the user has the required role
    if (userRole !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next(); // Proceed if role matches
  };
};


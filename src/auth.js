// auth.js

// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from './db.js'; // Import your MySQL connection
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variables in production

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from the database
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Compare passwords directly (not secure, for debugging only)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id_user, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    // Send token to the client
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong. Please try again later.' });
  }
});

// Verify Token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('No token found');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({ error: 'Invalid or expired token' });
  }
};


// User endpoint, using verifyToken middleware
router.get('/user', verifyToken, async (req, res) => {
  // Log the SQL query and parameters
  console.log(
    'Executing Query:',
    'SELECT * FROM users WHERE id_user = ?',
    [req.user.id] // Use req.user.id here (assuming id is the correct field)
  );

  // Execute the query to fetch user data from the database
  const [rows] = await connection.execute(
    'SELECT id_user, email, role FROM users WHERE id_user = ?',
    [req.user.id] // Use req.user.id from the decoded token
  );

  console.log('Rows from Database:', rows); // Log the query result to see if it matches

  if (rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(rows[0]);
});



export default router;

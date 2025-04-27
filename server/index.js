const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');

dotenv.config();
require('./config/passport')(passport); // Make sure to call the function

const app = express();
app.set('trust proxy', 1); // ✅ If you're using reverse proxy in production

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Session setup with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: 'lax', // 'strict' or 'lax' for local dev, 'none' for cross-site cookies
    secure: process.env.NODE_ENV === 'production', // In development, this should be false
  }
}));


app.use(passport.initialize());
app.use(passport.session());

// Route: authentication
app.use('/auth', authRoutes);

// Route: user info (used by frontend)
app.get('/auth/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(req.user);
});

// Route: logout
app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid');
    res.redirect(process.env.FRONTEND_URL);
  });
});




// Default route
app.get('/', (req, res) => res.send('🚀 Server Running'));

// Start server
app.listen(5000, () => console.log('✅ Server running on port 5000'));

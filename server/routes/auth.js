const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Authentication Route
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google Callback Route
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    // Redirect to frontend dashboard after successful login
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Get Authenticated User Info
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ message: 'Not authenticated' });
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Error logging out' });
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;

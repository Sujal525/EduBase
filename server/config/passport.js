const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const name = profile.displayName;

          // 🔍 Check if user exists by googleId OR email
          let user = await User.findOne({ 
            $or: [
              { googleId: googleId },
              { email: email }
            ]
          });

          if (!user) {
            // ✅ Create new user if not found
            user = await User.create({
              googleId,
              email,
              name,
              verification_status: 'verified'
            });
          } else {
            // ✅ Update googleId if it's missing
            if (!user.googleId) {
              user.googleId = googleId;
            }

            // ✅ Mark as verified if not already
            if (user.verification_status !== 'verified') {
              user.verification_status = 'verified';
            }

            await user.save();
          }

          return done(null, user);
        } catch (err) {
          console.error('❌ Error during Google authentication:', err);
          return done(err, null);
        }
      }
    )
  );

  // 🔐 Serialize/deserialize user
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  );
};

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, useMediaQuery } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import { Typewriter } from 'react-simple-typewriter';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showStatic, setShowStatic] = useState(false);

  const handleLaunchClick = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  // Show static text after typewriter is done
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatic(true);
    }, 2000 + 80 * 'Welcome to EduBase'.length); // typing time + delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/images/image.png)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 8,
          backdropFilter: 'blur(12px)',
          background: 'rgba(0, 0, 0, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          color: '#e0f7fa',
          animation: `${fadeIn} 1.2s ease-out`,
          maxWidth: '700px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <img
            src="/images/logo.png"
            alt="EduBase Logo"
            style={{
              width: isMobile ? '80px' : '100px',
              height: 'auto',
              marginBottom: '10px',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #64ffda, #18ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              minHeight: '80px',
            }}
          >
            {showStatic ? (
              'Welcome to EduBase'
            ) : (
              <Typewriter
                words={['Welcome to EduBase']}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={0}
                delaySpeed={2000}
              />
            )}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{ color: '#b2ebf2', opacity: 0.95, mb: 3, fontWeight: 400 }}
        >
          Revolutionizing education through AI & Blockchain.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#e0f7fa',
            opacity: 0.85,
            mb: 4,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
          }}
        >
          Experience a new era of learning where verified credentials meet intelligent assistance.
          <br />
          <strong>Secure. Scalable. Smart.</strong>
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
            color: '#fff',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(255, 75, 43, 0.5)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
              transform: 'scale(1.05)',
            },
          }}
          onClick={handleLaunchClick}
        >
          🚀 Launch App
        </Button>
      </Paper>
    </Box>
  );
};

export default LandingPage;

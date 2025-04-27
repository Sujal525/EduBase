import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tutorAgent } from '../../../../ai-agents/agents/tutorAgent.ts';
import MenuIcon from '@mui/icons-material/Menu';

const Tutor = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)'); // Check for mobile screens

  const handleAsk = async () => {
    if (!input.trim()) return;

    setIsTyping(true);
    setResponse('');
    setDisplayedResponse('');

    const res = await tutorAgent(input);
    setResponse(res);
  };

  useEffect(() => {
    if (!response || response === undefined) return;

    let index = 0;
    const delay = 30;

    // Ensure the first letter is included
    setDisplayedResponse(response.charAt(0)); // Start with the first letter immediately

    const typingInterval = setInterval(() => {
      if (index < response.length) {
        setDisplayedResponse((prev) => prev + response[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, delay);

    return () => clearInterval(typingInterval);
  }, [response]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tutor Agent', path: '/tutor-agent' },
    { label: 'Evaluator Agent', path: '/evaluator-agent' },
    { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' },
    { label: 'Proof of Achievement', path: '/proof-of-achievement' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fce4ec 0%, #ffffff 100%)',
      }}
    >
      {/* Stylish AppBar with Logo and Hamburger for mobile */}
      <AppBar
        position="sticky"
        elevation={3}
        sx={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src="/images/logo.png"
              alt="EduBase"
              style={{ height: '40px', marginRight: '12px' }}
            />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              EduBase Credential Portal
            </Typography>
          </Box>

          {/* Hamburger Menu for Mobile */}
          {isMobile ? (
            <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' }, color: 'black' }}  // Changed color to black
          >
            <MenuIcon sx={{ color: 'black' }} />  {/* Set color to black */}
          </IconButton>
          
          ) : (
            // Regular Menu for Larger Screens (Visible on desktop)
            menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  fontWeight: 500,
                  color: '#333',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'linear-gradient(to right, #64ffda, #18ffff)',
                    color: '#000',
                  },
                }}
              >
                {item.label}
              </Button>
            ))
          )}

          {/* Logout Button */}
          <Button
            onClick={() => navigate('/')}
            sx={{
              mx: 1,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
              borderRadius: '50px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(to right, #ff4b2b, #ff416c)',
              },
            }}
          >
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => navigate(item.path)}>
              {item.label}
            </MenuItem>
          ))}
        </Box>
      </Drawer>

      {/* Tutor Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 5,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '@media (max-width: 600px)': {
              p: 3, // Less padding on small screens
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #ff8a65, #ff7043)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🎓 AI Tutor Agent
          </Typography>

          <TextField
            fullWidth
            label="Ask your question"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{
              my: 3,
              '@media (max-width: 600px)': {
                width: '100%',
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleAsk}
            disabled={isTyping}
            sx={{
              background: 'linear-gradient(to right, #ff7043, #ff8a65)',
              color: '#fff',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              '&:hover': {
                background: 'linear-gradient(to right, #ff8a65, #ff7043)',
                transform: 'scale(1.03)',
              },
              '@media (max-width: 600px)': {
                width: '100%', // Button takes full width on small screens
                px: 3,
                py: 1.2,
              },
            }}
          >
            {isTyping ? (
              <>
                <CircularProgress size={20} sx={{ mr: 2, color: 'white' }} />
                Answering...
              </>
            ) : (
              'Ask Tutor'
            )}
          </Button>

          {displayedResponse && displayedResponse !== undefined && (
            <Card
              sx={{
                mt: 5,
                backgroundColor: '#ffebee',
                borderLeft: '6px solid #f4511e',
                textAlign: 'left',
                boxShadow: 3,
                width: '100%',
                '@media (max-width: 600px)': {
                  width: '100%',
                  mt: 3,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#f4511e',
                  }}
                >
                  🎓 Tutor Agent:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-line',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    color: '#333',
                    fontFamily: 'monospace',
                  }}
                >
                  {displayedResponse}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Tutor;

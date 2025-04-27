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
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { evaluatorAgent } from '../../../../ai-agents/agents/evaluatorAgent.ts';
import MenuIcon from '@mui/icons-material/Menu';

const Evaluator = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For Menu
  const [menuOpen, setMenuOpen] = useState(false); // For Menu visibility
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEvaluate = async () => {
    if (!input.trim()) return;

    setIsTyping(true);
    setResponse('');
    setDisplayedResponse('');

    const res = await evaluatorAgent(input);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = (path?: string) => {
    setMenuOpen(false);
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e1f5fe 0%, #ffffff 100%)',
      }}
    >
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={3}
        sx={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
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
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                sx={{ color: 'black' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
              >
                {[
                  { label: 'Dashboard', path: '/dashboard' },
                  { label: 'Tutor Agent', path: '/tutor-agent' },
                  { label: 'Evaluator Agent', path: '/evaluator-agent' },
                  { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' },
                  { label: 'Proof of Achievement', path: '/proof-of-achievement' },
                ].map((item, index) => (
                  <MenuItem key={index} onClick={() => handleMenuClose(item.path)}>
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => navigate('/')}>LOGOUT</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Desktop Navigation Buttons */}
              {[
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Tutor Agent', path: '/tutor-agent' },
                { label: 'Evaluator Agent', path: '/evaluator-agent' },
                { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' },
                { label: 'Proof of Achievement', path: '/proof-of-achievement' },
              ].map((item, index) => (
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
              ))}
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
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Evaluator Section */}
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
            width: '100%', // Ensures the Paper takes the full width
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #29b6f6, #0288d1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '3rem' }, // Responsive font size
            }}
          >
            🧪 AI Evaluator Agent
          </Typography>

          <TextField
            fullWidth
            label="Paste your answer for evaluation"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ my: 3 }}
          />

          <Button
            variant="contained"
            onClick={handleEvaluate}
            disabled={isTyping}
            sx={{
              background: 'linear-gradient(to right, #0288d1, #29b6f6)',
              color: '#fff',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              '&:hover': {
                background: 'linear-gradient(to right, #29b6f6, #0288d1)',
                transform: 'scale(1.03)',
              },
              width: { xs: '100%', sm: 'auto' }, // Full width on small screens
            }}
          >
            {isTyping ? (
              <>
                <CircularProgress size={20} sx={{ mr: 2, color: 'white' }} />
                Evaluating...
              </>
            ) : (
              'Evaluate Answer'
            )}
          </Button>

          {displayedResponse && displayedResponse !== undefined && (
            <Card
              sx={{
                mt: 5,
                backgroundColor: '#e1f5fe',
                borderLeft: '6px solid #0277bd',
                textAlign: 'left',
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#01579b',
                  }}
                >
                  🧠 Evaluator Agent:
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

export default Evaluator;

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import { useAccount, useSignMessage } from "wagmi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";

const TestPage = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const navigate = useNavigate();
  
  // State for menu visibility
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Media query for mobile responsiveness
  const isMobile = useMediaQuery("(max-width:600px)");

  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleGenerateProof = async () => {
    if (!address || !score) return;
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5002/generate-proof", {
        studentWallet: address,
        score: parseInt(score),
      });

      const generatedProof = response.data.proof;

      const message = JSON.stringify(generatedProof);
      const signature = await signMessageAsync({ message });

      setProof({ ...generatedProof, signature });
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error generating proof", err);
    } finally {
      setLoading(false);
    }
  };

  // Mobile menu toggle handler
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content using Box instead of ListItem
  const drawer = (
    <div>
      <Box>
        {[{ label: 'Dashboard', path: '/dashboard' },
        { label: 'Tutor Agent', path: '/tutor-agent' },
        { label: 'Evaluator Agent', path: '/evaluator-agent' },
        { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' },
        { label: 'Proof of Achievement', path: '/proof-of-achievement' }]
          .map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <Typography variant="h6">{item.label}</Typography>
            </Box>
          ))}
      </Box>
    </div>
  );

  return (
    <>
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

          {isMobile ? (
            // Mobile menu icon (Hamburger menu)
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ color: 'black' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // Desktop navigation buttons
            <Box sx={{ display: 'flex' }}>
              {[{ label: 'Dashboard', path: '/dashboard' },
                { label: 'Tutor Agent', path: '/tutor-agent' },
                { label: 'Evaluator Agent', path: '/evaluator-agent' },
                { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' },
                { label: 'Proof of Achievement', path: '/proof-of-achievement' }]
                .map((item, index) => (
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
            </Box>
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: '240px',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          fontWeight="bold"
          color="primary"
          sx={{
            fontSize: { xs: 'h4', sm: 'h3' }, // Responsive typography
          }}
        >
          🛡️ Zero Knowledge Test
        </Typography>

        <Box mt={4} display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Your Test Score"
            variant="outlined"
            fullWidth
            value={score}
            onChange={(e) => setScore(e.target.value)}
            type="number"
          />

          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={handleGenerateProof}
            disabled={loading || !address}
            sx={{ borderRadius: 3, py: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Proof and Sign"}
          </Button>

          {proof && (
            <Paper
              elevation={6}
              sx={{
                mt: 4,
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #e0f7fa, #f1f8e9)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              }}
            >
              <Box textAlign="center" mb={2}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="secondary"
                  gutterBottom
                >
                  ✅ Proof Successfully Generated
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Your credential proof has been created and signed!
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>👤 Wallet Address:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    background: "#ffffff",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  {proof.wallet}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>📄 Score Hash:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    background: "#ffffff",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  {proof.scoreHash}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>⏰ Timestamp:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    background: "#ffffff",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  {proof.timestamp}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>✍️ Signature:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    background: "#ffffff",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  {proof.signature}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Proof generated and signed!"
      />
    </>
  );
};

export default TestPage;

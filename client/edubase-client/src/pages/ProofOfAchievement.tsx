// src/pages/ProofOfAchievement.tsx

import React, { useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Modal,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { QRCode } from 'react-qrcode-logo';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger Icon
import { useMediaQuery } from '@mui/material';

interface Attestation {
  address: string;
  course: string;
  date: string;
  signature: string;
}

const ProofOfAchievement: React.FC = () => {
  const [address, setAddress] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [attestationResult, setAttestationResult] = useState('');
  const [latestAttestation, setLatestAttestation] = useState<Attestation | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For menu anchor
  const qrRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Media Query for responsiveness
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const handleCreateAttestation = async () => {
    try {
      if (!address || !course || !date) {
        alert('Please fill all fields.');
        return;
      }

      const signature = btoa(`${address}-${course}-${date}-${Date.now()}`);

      const attestation: Attestation = {
        address,
        course,
        date,
        signature,
      };

      const existingAttestations = JSON.parse(localStorage.getItem('attestations') || '[]');
      existingAttestations.push(attestation);
      localStorage.setItem('attestations', JSON.stringify(existingAttestations));

      const response = await axios.post('http://localhost:5001/attest-local', attestation);

      setAttestationResult(response.data.message);
      setLatestAttestation(attestation);
    } catch (error) {
      console.error('Error creating attestation:', error);
      setAttestationResult('Failed to create attestation.');
    }
  };

  const handleDownloadQR = () => {
    if (qrRef.current === null) return;

    toPng(qrRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'attestation-qr-code.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to download QR Code', err);
      });
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle menu toggle
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* App Bar */}
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

          {/* For Mobile Devices */}
          {isMobile ? (
            <IconButton
              onClick={handleMenuClick}
              sx={{ color: 'black' }} // Hamburger icon color
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // For Desktop Devices
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Tutor Agent', path: '/tutor-agent' }, { label: 'Evaluator Agent', path: '/evaluator-agent' }, { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' }, { label: 'Proof of Achievement', path: '/proof-of-achievement' }].map((item, index) => (
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

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Tutor Agent', path: '/tutor-agent' }, { label: 'Evaluator Agent', path: '/evaluator-agent' }, { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' }, { label: 'Proof of Achievement', path: '/proof-of-achievement' }].map((item, index) => (
          <MenuItem key={index} onClick={() => { navigate(item.path); handleMenuClose(); }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Main Container */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Proof of Achievement Attestation
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Your Wallet Address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="Course Name"
              variant="outlined"
              fullWidth
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
            <TextField
              label="Completion Date"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={handleCreateAttestation}>
              Create Attestation
            </Button>

            {attestationResult && (
              <Typography color="success.main" align="center" mt={2}>
                {attestationResult}
              </Typography>
            )}

            {latestAttestation && (
              <Box mt={4} textAlign="center">
                <Typography variant="h6" gutterBottom>
                  🎯 Your Attestation QR Code
                </Typography>
                <Box ref={qrRef} display="inline-block" mb={2}>
                  <QRCode
                    value={JSON.stringify(latestAttestation)}
                    size={250}
                    qrStyle="dots"
                    quietZone={10}
                    logoImage="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
                    logoWidth={40}
                  />
                </Box>

                <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                  <Button variant="outlined" color="secondary" onClick={handleDownloadQR}>
                    Download QR Code
                  </Button>

                  <Button variant="outlined" color="primary" onClick={handleOpenModal}>
                    Preview Full Attestation
                  </Button>
                </Box>

                <Typography variant="caption" display="block" mt={2}>
                  Scan or download your attestation!
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* JSON Preview Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflowY: 'auto',
              maxHeight: '90vh',
            }}
          >
            <Typography variant="h6" gutterBottom align="center">
              🛡️ Full Attestation Details
            </Typography>
            <Box
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontSize: '0.9rem',
                backgroundColor: '#f0f0f0',
                padding: 2,
                borderRadius: 2,
                maxHeight: '70vh',
                overflowY: 'auto',
              }}
            >
              {JSON.stringify(latestAttestation, null, 2)}
            </Box>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleCloseModal}
              sx={{ marginTop: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default ProofOfAchievement;

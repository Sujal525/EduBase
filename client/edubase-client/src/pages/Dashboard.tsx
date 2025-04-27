import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, Paper,
  Snackbar, Alert, CircularProgress, Card, CardContent, IconButton, Drawer, List, ListItemButton, ListItemText, Divider
} from '@mui/material';
import { Contract } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnect from '../components/WalletConnect.tsx';
import credentialNFT from '../../../../contracts/artifacts/contracts/CredentialNFT.sol/CredentialNFT.json' with {type:"json"};
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';

const contractAddress = '0xabc'; // Replace with deployed address

const Dashboard: React.FC = () => {
  const [minting, setMinting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintedTo, setMintedTo] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/user', {
          credentials: 'include',
        });

        if (!res.ok) {
          navigate('/');
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Auth error:', err);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('http://localhost:5000/auth/logout', {
      credentials: 'include',
    });
    navigate('/');
  };

  const getMetaMaskProvider = (): Web3Provider | null => {
    if (typeof window === 'undefined') return null;
    const { ethereum } = window as any;
    if (!ethereum || !ethereum.isMetaMask) {
      alert('MetaMask not detected.');
      return null;
    }
    return new Web3Provider(ethereum);
  };

  const mintCredentialWithMetaMask = async () => {
    try {
      const provider = getMetaMaskProvider();
      if (!provider) return;

      setMinting(true);
      setShowSuccess(false);
      setMintedTo(null);

      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new Contract(contractAddress, credentialNFT.abi, signer);
      const recipient = await signer.getAddress();

      const tokenURI = 'https://example.com/test-metadata';
      const tx = await contract.mintCredential(recipient, tokenURI);
      await tx.wait();

      setShowSuccess(true);
      setMintedTo(recipient);
    } catch (err) {
      console.error('Minting error:', err);
      alert('Minting failed.');
    } finally {
      setMinting(false);
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
      }}
    >
      <AppBar
        position="sticky"
        elevation={3}
        sx={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'black' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
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

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            background: 'rgba(255,255,255,0.9)',
            minHeight: '100vh',
            paddingTop: 2,
            boxShadow: 3,
          }}
        >
          <List>
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Tutor Agent', path: '/tutor-agent' },
              { label: 'Evaluator Agent', path: '/evaluator-agent' },
              { label: 'Zero Knowledge Test', path: '/zero-knowledge-test' },
              { label: 'Proof of Achievement', path: '/proof-of-achievement' },
            ].map((item, index) => (
              <ListItemButton key={index} onClick={() => navigate(item.path)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Button
            fullWidth
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '50px',
              padding: '12px 0',
            }}
          >
            LOGOUT
          </Button>
        </Box>
      </Drawer>

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
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #64ffda, #18ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
            }}
          >
            🎓 Welcome to EduBase
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
            Connect your wallet and mint your verified academic credential on the blockchain.
          </Typography>

          {user && (
            <Typography variant="subtitle1" sx={{ mb: 2, color: '#1976d2' }}>
              👤 Logged in as: <b>{user.email}</b> |{' '}
              {user.verification_status === 'verified' ? '✅ Verified' : '⏳ Pending Verification'}
            </Typography>
          )}

          <Card
            sx={{
              mb: 3,
              px: 3,
              py: 2,
              borderLeft: '6px solid #00acc1',
              backgroundColor: '#f1fefe',
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔗 Wallet Connection
              </Typography>
              <WalletConnect />
            </CardContent>
          </Card>

          <Card
            sx={{
              px: 3,
              py: 2,
              borderLeft: '6px solid #ab47bc',
              backgroundColor: '#f9f0ff',
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Mint Credential NFT
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ab47bc',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#8e24aa' },
                }}
                onClick={mintCredentialWithMetaMask}
                disabled={minting}
              >
                {minting ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Mint Now'
                )}
              </Button>
            </CardContent>
          </Card>
        </Paper>
      </Container>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Minting Successful! 🎉
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;

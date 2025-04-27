// src/components/WalletConnect.tsx

import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { provider } from '../utils/onchainkit.ts';

const WalletConnect: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);

  // Function to connect the wallet
  const connectWallet = async () => {
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Error connecting to the wallet. Please make sure Coinbase Wallet is installed.');
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setAddress(null);  // Simply clear the address on disconnect
  };

  return (
    <div>
      {address ? (
        <>
          <Typography variant="body1">Connected: {address}</Typography>
          <Button variant="outlined" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;

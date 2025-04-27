// src/OnchainKitProviderWrapper.tsx

import React from 'react';
import { base } from 'wagmi/chains'; // Ensure you're importing from 'wagmi/chains'
import { OnchainKitProvider } from '@coinbase/onchainkit';

interface Props {
  children: React.ReactNode;
}

const OnchainKitProviderWrapper: React.FC<Props> = ({ children }) => {
  return (
    <OnchainKitProvider
      apiKey="1AYaqsh0OBtpJ0qscgDzIhrZh1uoTNoE" // Replace with your actual API key
      chain={base}
    >
      {children}
    </OnchainKitProvider>
  );
};

export default OnchainKitProviderWrapper;

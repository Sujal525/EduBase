import { WalletLinkConnector } from '@web3-react/walletlink-connector';

// Set up Coinbase Wallet connector
export const coinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`, // Replace with your Infura Project ID
  appName: 'EduBase Credential Portal',
  supportedChainIds: [1], // Mainnet
});

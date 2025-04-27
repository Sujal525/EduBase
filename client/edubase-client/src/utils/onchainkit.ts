import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const APP_NAME = 'EduBase';  // Change this to your app name
const APP_LOGO_URL = 'https://yourdomain.com/logo.png';  // Optional: Replace with your logo URL

// Initialize CoinbaseWalletSDK without appChainIds
const coinbaseWallet = new CoinbaseWalletSDK({
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL,  // Optional: Replace with your logo URL
});

// Create the Web3 provider without specifying chainIds in the config
export const provider = coinbaseWallet.makeWeb3Provider();

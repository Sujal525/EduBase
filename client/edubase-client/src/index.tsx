// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Use 'react-dom/client' for React 18+
import App from './App.tsx';
import '@coinbase/onchainkit/styles.css';

// Ensure the root div is available in index.html (inside public folder)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

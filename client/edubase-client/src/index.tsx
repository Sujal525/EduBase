// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Use 'react-dom/client' for React 18+
import App from './App.tsx';
import '@coinbase/onchainkit/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // 👈 Fix typing with 'as HTMLElement'
root.render(<App />);

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Import Tailwind and global styles
import App from './App.jsx';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

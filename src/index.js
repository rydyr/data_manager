//src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { BuildProvider } from './context/BuildContext.js';
import dotenv from 'dotenv';

dotenv.config();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BuildProvider>
    <App />
  </BuildProvider>
);
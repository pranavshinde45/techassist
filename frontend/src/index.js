import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './components/contexts/authContext';
import { BrowserRouter } from 'react-router-dom';
import Routes from './components/Routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <React.StrictMode>
        <Routes />
      </React.StrictMode>
    </AuthProvider>
  </BrowserRouter>
);

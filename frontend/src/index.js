import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signup from './components/auth/Signup';
import { AuthProvider } from './components/contexts/authContext';
import { BrowserRouter } from 'react-router-dom';
import Routes from './components/Routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);


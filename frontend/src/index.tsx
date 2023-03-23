import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import Navigation from './components/Navigation';
import { AppProvider } from './components/context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <Navigation />
    </AppProvider>
  </React.StrictMode>
);

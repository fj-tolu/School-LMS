import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './contexts/ToastContext';
import { NebulaProvider } from './contexts/NebulaContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <ToastProvider>
    <NebulaProvider>
      <App />
    </NebulaProvider>
  </ToastProvider>
);
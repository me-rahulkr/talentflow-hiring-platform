import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
 
  const { worker } = await import('./api/browser.js');
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and running.
  return worker.start();
}
 
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
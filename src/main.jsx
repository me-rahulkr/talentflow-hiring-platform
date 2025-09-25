import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

async function enableMocking() {
  // Humne yahan se development check wali 'if' condition hata di hai
  // Ab mock server hamesha start hoga
  const { worker } = await import('./api/browser.js');
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
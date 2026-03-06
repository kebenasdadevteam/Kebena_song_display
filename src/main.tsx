import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DisplayPage from './imports/display-page';
import './styles/globals.css';

const isDisplayRoute = globalThis.location.pathname.startsWith('/display/');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isDisplayRoute ? <DisplayPage /> : <App />}
  </React.StrictMode>
);

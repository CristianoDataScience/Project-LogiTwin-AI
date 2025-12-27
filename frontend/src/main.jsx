import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SimulationProvider>
        <App />
      </SimulationProvider>
    </BrowserRouter>
  </StrictMode>,
);

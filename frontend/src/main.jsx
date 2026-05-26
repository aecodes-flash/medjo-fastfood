import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './components/CartContext.jsx'
import { useAuthStore } from './Store/useAuthStore';
createRoot(document.getElementById('root')).render(
    <StrictMode>
    <BrowserRouter>
    <App />
        <Toaster position="top-center"/>
    </BrowserRouter>
    </StrictMode>,
);

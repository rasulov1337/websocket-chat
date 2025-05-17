import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import '@fontsource/inter';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import store from './store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <App />
            </Provider>
        </ThemeProvider>
    </StrictMode>
);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

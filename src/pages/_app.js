import '@/styles/globals.css';
import { CssBaseline, GeistProvider } from '@geist-ui/core';

export default function App({ Component, pageProps }) {
    return (
        <GeistProvider>
            <CssBaseline />
            <Component {...pageProps} />
        </GeistProvider>
    );
}

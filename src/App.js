import React from 'react';
import { MantineProvider } from '@mantine/core';
import LandingPage from './LandingPage/landingPage.jsx';
import '@mantine/core/styles.css';

function App() {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <LandingPage/>
        </MantineProvider>
    );
}

export default App;
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AppProvider } from './contexts/AppContext';

function App() {
    return (
        <AppProvider>
            <RouterProvider router={router} />
        </AppProvider>
    );
}

export default App;

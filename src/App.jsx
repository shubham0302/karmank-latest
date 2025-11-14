import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import KarmAnkApp from './karmank'; // Import your main app component

// The AppWrapper provides the background and base styles
const App = () => (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="min-h-screen bg-indigo-900 text-gray-200 font-sans p-4 md:p-8" style={{background: 'radial-gradient(circle, rgba(23,20,69,1) 0%, rgba(12,10,42,1) 100%)'}}>
                                <KarmAnkApp />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import KarmAnkApp from './karmank';
import NameAnalysisPage from './pages/NameAnalysisPage';
import CompatibilityPage from './pages/CompatibilityPage';
import GitaGyanPage from './pages/GitaGyanPage';

const App = () => (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/numerology"
                    element={
                        <ProtectedRoute>
                            <KarmAnkApp />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/name-analysis"
                    element={
                        <ProtectedRoute>
                            <NameAnalysisPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/compatibility"
                    element={
                        <ProtectedRoute>
                            <CompatibilityPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gita-gyan"
                    element={
                        <ProtectedRoute>
                            <GitaGyanPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);

export default App;
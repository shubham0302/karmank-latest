import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import KarmAnkApp from './karmank';
import NameAnalysisPage from './pages/NameAnalysisPage';
import CosmicCompatibilityPage from './pages/CosmicCompatibilityPage';
import GitaGyanPage from './pages/GitaGyanPage';
import AssetVibrationPage from './pages/AssetVibrationPage';
import CareerPathPage from './pages/CareerPathPage';

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
                            <CosmicCompatibilityPage />
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
                <Route
                    path="/asset-vibration"
                    element={
                        <ProtectedRoute>
                            <AssetVibrationPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/career-path"
                    element={
                        <ProtectedRoute>
                            <CareerPathPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);

export default App;
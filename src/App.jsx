import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import KarmAnkApp from './karmank';
import NameAnalysisPage from './pages/NameAnalysisPage';
import CosmicCompatibilityPage from './pages/CosmicCompatibilityPage';
import GitaGyanPage from './pages/GitaGyanPage';
import AssetVibrationPage from './pages/AssetVibrationPage';
import CareerPathPage from './pages/CareerPathPage';
import PalmistryPage from './pages/PalmistryPage';
import MantraJaapPage from './pages/MantraJaapPage';
import PanchangPage from './pages/PanchangPage';
import FestivalsPage from './pages/FestivalsPage';
import CosmicDailyPage from './pages/CosmicDailyPage';

// Lazy-loaded astrology pages (heavy bundle — split into separate chunk)
const AstrologyPage = lazy(() => import('./astrology/pages/AstrologyPage'));
const AstrologyYogaLab = lazy(() => import('./astrology/pages/YogaLabLive'));
const AstrologyRemedies = lazy(() => import('./astrology/pages/Remedies'));
const AstrologyStotras = lazy(() => import('./astrology/pages/StotrasLibrary'));
const AstrologyAstrologer = lazy(() => import('./astrology/pages/Astrologer'));

// Fallback loader for lazy pages
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
);
import FamilyMembersPage from './pages/FamilyMembersPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import RefundPage from './pages/RefundPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AboutPage from './pages/AboutPage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Prevent aggressive re-fetch storms (especially when backend is offline)
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/refund" element={<RefundPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />

                {/* Protected Routes */}
                <Route
                    path="/onboarding"
                    element={
                        <ProtectedRoute>
                            <OnboardingPage />
                        </ProtectedRoute>
                    }
                />
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
                <Route
                    path="/palmistry"
                    element={
                        <ProtectedRoute>
                            <PalmistryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mantra-jaap"
                    element={
                        <ProtectedRoute>
                            <MantraJaapPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/panchang"
                    element={
                        <ProtectedRoute>
                            <PanchangPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/festivals"
                    element={
                        <ProtectedRoute>
                            <FestivalsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cosmic-daily"
                    element={
                        <ProtectedRoute>
                            <CosmicDailyPage />
                        </ProtectedRoute>
                    }
                />
                {/* Astrology routes — lazy loaded for performance */}
                <Route
                    path="/astrology"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <AstrologyPage />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/astrology/yoga-lab"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <AstrologyYogaLab />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/astrology/remedies"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <AstrologyRemedies />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/astrology/stotras"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <AstrologyStotras />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/astrology/astrologer"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <AstrologyAstrologer />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/family-members"
                    element={
                        <ProtectedRoute>
                            <FamilyMembersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    </QueryClientProvider>
);

export default App;

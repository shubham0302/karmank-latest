import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';

// ─── Lazy-load ALL pages ───────────────────────────────────────────────────────
// Only the shell (AuthProvider, ErrorBoundary, ProtectedRoute) loads upfront.
// Each page chunk is downloaded only when the user first navigates to that route.

// Auth
const LoginPage             = lazy(() => import('./components/auth/LoginPage'));

// Public info pages (lightweight)
const AboutPage             = lazy(() => import('./pages/AboutPage'));
const FeedbackPage          = lazy(() => import('./pages/FeedbackPage'));
const TermsPage             = lazy(() => import('./pages/TermsPage'));
const PrivacyPage           = lazy(() => import('./pages/PrivacyPage'));
const RefundPage            = lazy(() => import('./pages/RefundPage'));
const DisclaimerPage        = lazy(() => import('./pages/DisclaimerPage'));

// Core protected pages
const HomePage              = lazy(() => import('./pages/HomePage'));
const OnboardingPage        = lazy(() => import('./pages/OnboardingPage'));
const ProfilePage           = lazy(() => import('./pages/ProfilePage'));
const FamilyMembersPage     = lazy(() => import('./pages/FamilyMembersPage'));

// Feature pages — heavy, only load when visited
const KarmAnkApp            = lazy(() => import('./karmank'));               // 3.3 MB (data.js)
const NameAnalysisPage      = lazy(() => import('./pages/NameAnalysisPage'));
const CosmicCompatibilityPage = lazy(() => import('./pages/CosmicCompatibilityPage'));
const GitaGyanPage          = lazy(() => import('./pages/GitaGyanPage'));
const AssetVibrationPage    = lazy(() => import('./pages/AssetVibrationPage'));
const CareerPathPage        = lazy(() => import('./pages/CareerPathPage'));
const PalmistryPage         = lazy(() => import('./pages/PalmistryPage'));
const MantraJaapPage        = lazy(() => import('./pages/MantraJaapPage'));
const PanchangPage          = lazy(() => import('./pages/PanchangPage'));
const FestivalsPage         = lazy(() => import('./pages/FestivalsPage'));
const CosmicDailyPage       = lazy(() => import('./pages/CosmicDailyPage'));
const MuhurtaPage           = lazy(() => import('./pages/MuhurtaPage'));
const VarshaphalaPage       = lazy(() => import('./pages/VarshaphalaPage'));

// Astrology suite — heaviest chunks
const AstrologyPage         = lazy(() => import('./astrology/pages/AstrologyPage'));
const AstrologyYogaLab      = lazy(() => import('./astrology/pages/YogaLabLive'));   // 700 KB
const AstrologyRemedies     = lazy(() => import('./astrology/pages/Remedies'));
const AstrologyStotras      = lazy(() => import('./astrology/pages/StotrasLibrary'));
const AstrologyAstrologer   = lazy(() => import('./astrology/pages/Astrologer'));

// ─── Shared page-level loading spinner ────────────────────────────────────────
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
);

// ─── React Query client ────────────────────────────────────────────────────────
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

// ─── App ───────────────────────────────────────────────────────────────────────
const App = () => (
    <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    {/* Single Suspense boundary — spinner shown during any page chunk download */}
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* ── Public Routes ── */}
                            <Route path="/login"      element={<LoginPage />} />
                            <Route path="/about"      element={<AboutPage />} />
                            <Route path="/feedback"   element={<FeedbackPage />} />
                            <Route path="/terms"      element={<TermsPage />} />
                            <Route path="/privacy"    element={<PrivacyPage />} />
                            <Route path="/refund"     element={<RefundPage />} />
                            <Route path="/disclaimer" element={<DisclaimerPage />} />

                            {/* ── Protected Routes ── */}
                            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
                            <Route path="/"           element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                            <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/family-members" element={<ProtectedRoute><FamilyMembersPage /></ProtectedRoute>} />

                            {/* ── Feature Routes ── */}
                            <Route path="/numerology"       element={<ProtectedRoute><KarmAnkApp /></ProtectedRoute>} />
                            <Route path="/name-analysis"    element={<ProtectedRoute><NameAnalysisPage /></ProtectedRoute>} />
                            <Route path="/compatibility"    element={<ProtectedRoute><CosmicCompatibilityPage /></ProtectedRoute>} />
                            <Route path="/gita-gyan"        element={<ProtectedRoute><GitaGyanPage /></ProtectedRoute>} />
                            <Route path="/asset-vibration"  element={<ProtectedRoute><AssetVibrationPage /></ProtectedRoute>} />
                            <Route path="/career-path"      element={<ProtectedRoute><CareerPathPage /></ProtectedRoute>} />
                            <Route path="/palmistry"        element={<ProtectedRoute><PalmistryPage /></ProtectedRoute>} />
                            <Route path="/mantra-jaap"      element={<ProtectedRoute><MantraJaapPage /></ProtectedRoute>} />
                            <Route path="/panchang"         element={<ProtectedRoute><PanchangPage /></ProtectedRoute>} />
                            <Route path="/festivals"        element={<ProtectedRoute><FestivalsPage /></ProtectedRoute>} />
                            <Route path="/cosmic-daily"     element={<ProtectedRoute><CosmicDailyPage /></ProtectedRoute>} />
                            <Route path="/astrology/muhurta"      element={<ProtectedRoute><MuhurtaPage /></ProtectedRoute>} />
                            <Route path="/astrology/varshaphala"  element={<ProtectedRoute><VarshaphalaPage /></ProtectedRoute>} />

                            {/* ── Astrology Suite ── */}
                            <Route path="/astrology"              element={<ProtectedRoute><AstrologyPage /></ProtectedRoute>} />
                            <Route path="/astrology/yoga-lab"     element={<ProtectedRoute><AstrologyYogaLab /></ProtectedRoute>} />
                            <Route path="/astrology/remedies"     element={<ProtectedRoute><AstrologyRemedies /></ProtectedRoute>} />
                            <Route path="/astrology/stotras"      element={<ProtectedRoute><AstrologyStotras /></ProtectedRoute>} />
                            <Route path="/astrology/astrologer"   element={<ProtectedRoute><AstrologyAstrologer /></ProtectedRoute>} />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    </QueryClientProvider>
);

export default App;

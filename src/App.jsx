import React, { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';

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

// ─── World-class route transitions (directional) ───────────────────────────────
const getRouteDepth = (pathname) => {
    if (!pathname || pathname === '/') return 0;
    return pathname.split('/').filter(Boolean).length;
};

const PageTransition = ({ children, direction = 1 }) => {
    const variants = {
        initial: (dir) => ({
            opacity: 0,
            x: dir > 0 ? 28 : -28,
            filter: 'blur(10px)',
        }),
        animate: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
        },
        exit: (dir) => ({
            opacity: 0,
            x: dir > 0 ? -18 : 18,
            filter: 'blur(10px)',
        }),
    };

    return (
        <motion.div
            className="min-h-screen"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();
    const prevPathRef = useRef(location.pathname);

    const direction = useMemo(() => {
        const prevPath = prevPathRef.current;
        const prevDepth = getRouteDepth(prevPath);
        const nextDepth = getRouteDepth(location.pathname);
        return nextDepth >= prevDepth ? 1 : -1;
    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [location.pathname]);

    useEffect(() => {
        prevPathRef.current = location.pathname;
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                {/* ── Public Routes ── */}
                <Route path="/login" element={<PageTransition direction={direction}><LoginPage /></PageTransition>} />
                <Route path="/about" element={<PageTransition direction={direction}><AboutPage /></PageTransition>} />
                <Route path="/feedback" element={<PageTransition direction={direction}><FeedbackPage /></PageTransition>} />
                <Route path="/terms" element={<PageTransition direction={direction}><TermsPage /></PageTransition>} />
                <Route path="/privacy" element={<PageTransition direction={direction}><PrivacyPage /></PageTransition>} />
                <Route path="/refund" element={<PageTransition direction={direction}><RefundPage /></PageTransition>} />
                <Route path="/disclaimer" element={<PageTransition direction={direction}><DisclaimerPage /></PageTransition>} />

                {/* ── Protected Routes ── */}
                <Route
                    path="/onboarding"
                    element={<PageTransition direction={direction}><ProtectedRoute><OnboardingPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/"
                    element={<PageTransition direction={direction}><ProtectedRoute><HomePage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/profile"
                    element={<PageTransition direction={direction}><ProtectedRoute><ProfilePage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/family-members"
                    element={<PageTransition direction={direction}><ProtectedRoute><FamilyMembersPage /></ProtectedRoute></PageTransition>}
                />

                {/* ── Feature Routes ── */}
                <Route
                    path="/numerology"
                    element={<PageTransition direction={direction}><ProtectedRoute><KarmAnkApp /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/name-analysis"
                    element={<PageTransition direction={direction}><ProtectedRoute><NameAnalysisPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/compatibility"
                    element={<PageTransition direction={direction}><ProtectedRoute><CosmicCompatibilityPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/gita-gyan"
                    element={<PageTransition direction={direction}><ProtectedRoute><GitaGyanPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/asset-vibration"
                    element={<PageTransition direction={direction}><ProtectedRoute><AssetVibrationPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/career-path"
                    element={<PageTransition direction={direction}><ProtectedRoute><CareerPathPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/palmistry"
                    element={<PageTransition direction={direction}><ProtectedRoute><PalmistryPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/mantra-jaap"
                    element={<PageTransition direction={direction}><ProtectedRoute><MantraJaapPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/panchang"
                    element={<PageTransition direction={direction}><ProtectedRoute><PanchangPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/festivals"
                    element={<PageTransition direction={direction}><ProtectedRoute><FestivalsPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/cosmic-daily"
                    element={<PageTransition direction={direction}><ProtectedRoute><CosmicDailyPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/astrology/muhurta"
                    element={<PageTransition direction={direction}><ProtectedRoute><MuhurtaPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/astrology/varshaphala"
                    element={<PageTransition direction={direction}><ProtectedRoute><VarshaphalaPage /></ProtectedRoute></PageTransition>}
                />

                {/* ── Astrology Suite ── */}
                <Route
                    path="/astrology"
                    element={<PageTransition direction={direction}><ProtectedRoute><AstrologyPage /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/astrology/yoga-lab"
                    element={<PageTransition direction={direction}><ProtectedRoute><AstrologyYogaLab /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/astrology/remedies"
                    element={<PageTransition direction={direction}><ProtectedRoute><AstrologyRemedies /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/astrology/stotras"
                    element={<PageTransition direction={direction}><ProtectedRoute><AstrologyStotras /></ProtectedRoute></PageTransition>}
                />
                <Route
                    path="/astrology/astrologer"
                    element={<PageTransition direction={direction}><ProtectedRoute><AstrologyAstrologer /></ProtectedRoute></PageTransition>}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

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
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    {/* Single Suspense boundary — spinner shown during any page chunk download */}
                    <Suspense fallback={<PageLoader />}>
                        <AnimatedRoutes />
                    </Suspense>
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    </QueryClientProvider>
);

export default App;

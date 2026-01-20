import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from './ui/button';

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 * Prevents the entire app from crashing due to component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('❌ Error Boundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Optional: Send error to logging service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-4"
             style={{
               background: 'radial-gradient(circle at 50% 50%, rgba(23,20,69,1) 0%, rgba(12,10,42,1) 100%)'
             }}>
          <div className="max-w-2xl w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-red-400/30 p-8 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-500/20 rounded-full">
                  <AlertCircle className="h-16 w-16 text-red-400" />
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-center text-white mb-4">
                Oops! Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-center text-white/70 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {/* Development-only error details */}
              {isDevelopment && this.state.error && (
                <div className="bg-black/40 rounded-lg p-4 mb-6 border border-red-500/30">
                  <p className="text-red-400 font-mono text-sm mb-2 font-bold">
                    Error Details (Dev Mode):
                  </p>
                  <p className="text-red-300 font-mono text-xs mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-red-400 text-xs cursor-pointer hover:text-red-300">
                        Stack Trace
                      </summary>
                      <pre className="text-red-300 text-xs mt-2 overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Error Count Warning */}
              {this.state.errorCount > 2 && (
                <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm text-center">
                    ⚠️ Multiple errors detected. If this persists, please refresh the page or contact support.
                  </p>
                </div>
              )}

              {/* Help Text */}
              <p className="text-center text-white/50 text-xs mt-6">
                If the problem persists, please try refreshing your browser or contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

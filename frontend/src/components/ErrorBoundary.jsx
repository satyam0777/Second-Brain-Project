import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-lg w-full">
            <h1 className="text-3xl font-bold text-red-400 mb-4">⚠️ Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-gray-400 mb-2">Error Details (Dev Mode)</summary>
                <pre className="bg-black/30 p-4 rounded overflow-auto text-xs text-red-300">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors w-full"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

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
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Error Details:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {this.state.error && this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Stack Trace:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
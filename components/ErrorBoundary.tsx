import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

// FIX: Changed from `React.Component` to `Component` to align with the direct import, resolving the issue where TypeScript couldn't find the `props` property.
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 dark:bg-dark-bg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Something went wrong.</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            A component has crashed. Please try refreshing the page or navigating to a different section.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
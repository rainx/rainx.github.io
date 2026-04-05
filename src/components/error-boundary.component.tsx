import { Component, type ErrorInfo, type ReactNode } from 'react';

interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Section error:', error, errorInfo);
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { fallback, children } = this.props;
    if (hasError) {
      return fallback ?? null;
    }
    return children;
  }
}

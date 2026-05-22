import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0e1a] text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-destructive/5 blur-[120px] pointer-events-none" />

          <div className="w-full max-w-md glass-card border border-destructive/20 bg-card/30 p-8 sm:p-10 rounded-3xl shadow-xl backdrop-blur-md text-center z-10 space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-destructive/10 rounded-full border border-destructive/20 text-destructive animate-pulse">
                <AlertTriangle size={48} />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected application error has occurred. We've logged this issue and are working to resolve it.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Error Details:
                </p>
                <p className="text-xs font-mono text-destructive break-all max-h-24 overflow-y-auto leading-relaxed">
                  {this.state.error.message || "Unknown rendering error"}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all glow-effect-sm"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 hover:bg-secondary px-5 py-3 text-sm font-semibold text-foreground transition-all"
              >
                <Home size={16} />
                Go to Home
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

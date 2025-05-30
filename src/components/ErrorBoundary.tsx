'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/90 to-slate-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 bg-blue-950/10 border-blue-900/50">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                <p className="text-blue-300/80">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="w-full h-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center gap-3 text-base font-medium shadow-md transition-all duration-150 ease-in-out rounded-xl border border-slate-800/50 hover:scale-[1.02] hover:shadow-lg hover:border-blue-800/50 active:scale-[0.98]"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
} 
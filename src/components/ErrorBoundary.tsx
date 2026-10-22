import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center px-4 py-12 text-center bg-[#f8f7f4]">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-500" />
          </div>
          <h2 className="font-caveat text-3xl font-bold text-[#ef72b4] mb-1">
            {this.props.fallbackTitle || 'Terjadi Kesalahan'}
          </h2>
          <p className="font-patrick text-sm text-[#527595] max-w-sm mb-5 leading-relaxed">
            Maaf, ada bagian undangan yang gagal dimuat. Silakan muat ulang halaman ini.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5797d0] hover:bg-[#4383bd] active:scale-95 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
          {this.state.error?.message && (
            <p className="mt-5 text-[10px] font-mono text-gray-400 max-w-md break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ReactNode } from 'react';
import { RefreshCcw, AlertOctagon } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1E293B] flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 mb-2">
              <AlertOctagon size={40} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">AceTutor Glitch</h1>
              <p className="opacity-60">Something unexpected happened. It might be a connection blip or a data sync error.</p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-black/20 rounded-xl text-xs font-mono text-pink-400 overflow-auto max-h-32 text-left">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-ink-blue/80 hover:bg-ink-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-ink-blue/20"
            >
              <RefreshCcw size={20} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

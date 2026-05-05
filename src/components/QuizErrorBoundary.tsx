/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
}

class QuizErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Quiz Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="scribble-box p-8 text-center space-y-6 bg-red-500/10 border-red-500/50">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-500">Quiz Load Error</h2>
            <p className="opacity-70 mt-2">I couldn't find the practice papers for this specific subject yet. Let's try the AI Tutor instead!</p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full mx-auto hover:bg-red-600 transition-colors"
          >
            <RefreshCcw size={18} /> Back to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default QuizErrorBoundary;

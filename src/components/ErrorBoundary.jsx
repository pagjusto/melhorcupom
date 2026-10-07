import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro não tratado:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E0E14] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#181824] border border-orange-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 text-[#FF5F00] flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-xl font-black">Ops! Algo inesperado aconteceu</h2>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Ocorreu uma instabilidade pontual na interface, mas seus dados e cupons estão seguros.
            </p>

            {this.state.error && (
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-left text-red-300/80 overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-[#FF5F00] hover:bg-[#E04F00] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Recarregar Página</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

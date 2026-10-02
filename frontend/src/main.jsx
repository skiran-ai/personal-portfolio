import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07090e',
          color: '#f8fafc',
          padding: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h1 style={{ color: '#00f2fe', marginBottom: '16px' }}>Portfolio Interface Notice</h1>
          <p style={{ color: '#94a3b8', maxWidth: '600px', textAlign: 'center', marginBottom: '24px' }}>
            A rendering issue occurred: {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe, #38bdf8)',
              color: '#07090e',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reload Portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)


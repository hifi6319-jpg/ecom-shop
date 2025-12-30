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
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#333' }}>
                    <h1 style={{ color: '#e11d48' }}>Something went wrong.</h1>
                    <p>Please report this error to the developer.</p>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Error:</h3>
                        <pre style={{ color: '#dc2626', overflowX: 'auto' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.25rem' }}>Component Stack:</h3>
                        <pre style={{ fontSize: '0.875rem', overflowX: 'auto' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

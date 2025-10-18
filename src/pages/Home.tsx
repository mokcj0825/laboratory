import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div style={{
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            padding: 24
        }}>
            <h1>Laboratory</h1>
            <p>Welcome. React app is up and running.</p>
            <nav style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
                <Link to="/application/sql-converter" style={{ textDecoration: 'none' }}>SQLConverter</Link>
                <Link to="/application/tool-2" style={{ textDecoration: 'none' }}>Tool 2</Link>
            </nav>
        </div>
    );
}



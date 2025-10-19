import React from 'react';
import { Link } from 'react-router-dom';

export default function ApplicationLayout() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Applications</h1>
            <nav style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <Link to="/application/tool-1" style={{ textDecoration: 'none' }}>Tool 1</Link>
                <Link to="/application/tool-2" style={{ textDecoration: 'none' }}>Tool 2</Link>
            </nav>
        </div>
    );
}



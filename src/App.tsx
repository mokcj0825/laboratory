import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Tool2 from './application/Tool2';
import ApplicationLayout from './application/Layout';
import SQLConverter from './application/SQLConverter';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/application/sql-converter" element={<SQLConverter />} />
            <Route path="/application/tool-2" element={<Tool2 />} />
            <Route path="/application" element={<ApplicationLayout />} />
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
}



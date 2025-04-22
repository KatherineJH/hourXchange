// AppLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';

const Body = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div>
                메인{children}
            </div>
        </div>
    );
};

export default Body;

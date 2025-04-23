// AppLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Login from '../userComponent/Login.jsx';

const Body = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div>
                {children}
            </div>
            <Login/>
        </div>
    );
};

export default Body;

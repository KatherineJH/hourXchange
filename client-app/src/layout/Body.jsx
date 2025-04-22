// AppLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Login from '../userComponent/Login.jsx';

const Body = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div>
                메인{children}
            </div>
            <Login/>
        </div>
    );
};

export default Body;

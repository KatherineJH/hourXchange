import React from 'react';
import Header from "./Header.jsx";
import Body from "./Body.jsx";
import Footer from "./Footer.jsx";


function MainLayout({children}) {
    return (
        <>
            <Header/>
            <Body>
                {children}
            </Body>
            <Footer/>
        </>

    );
}

export default MainLayout;
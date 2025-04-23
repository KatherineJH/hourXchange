// Header.jsx
import * as React from 'react';
import {Link} from 'react-router-dom';



function Header() {

    return (
        <div>
            <div>
                <h2>제품</h2>
                <Link to="/serviceProduct/read/">읽기</Link>
                <Link to="/serviceProduct/list">리스트</Link>
                <Link to="/serviceProduct/save">저장</Link>
                <Link to="/serviceProduct/save">수정</Link>
            </div>

        </div>
    );
}

export default Header;

import React, {useState} from 'react';
import AddressForm from "./AddressForm.jsx";
import {postSave} from "../../api/userApi.js";
import {data} from "react-router-dom";

const initState = {
    name: '',
    username: '',
    password: '',
    passwordCheck: '',
    email: '',
    birthday: '',
    zonecode: '',
    roadAddress: '',
    jibunAddress: '',
    detailAddress: ''
}


function Save(props) {
    // // 주소 상태
    // const [addr, setAddr] = useState({
    //     zonecode: '',      // 우편번호
    //     roadAddress: '',   // 도로명
    //     jibunAddress: '',  // 지번
    //     detailAddress: ''  // 상세주소 (사용자 입력)
    // });

    const [saveData, setSaveData] = useState(initState)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSaveData({...saveData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(saveData);
        // try{
        //     const response = postSave(addr)
        //     console.log(response.data);
        // }catch (error){
        //     console.log(error);
        // }

    }


    return (
        <form>
            <div>
                <label htmlFor="email">이메일</label>
                <input type="text" id="email" name="email" value={saveData.email} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="password">비밀번호</label>
                <input type="text" id="password" name="password" value={saveData.password} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="passwordCheck">비밀번호확인</label>
                <input type="text" id="passwordCheck" name="passwordCheck" value={saveData.passwordCheck} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="name">이름</label>
                <input type="text" id="name" name="name" value={saveData.name} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="username">별명</label>
                <input type="text" id="username" name="username" value={saveData.username} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="birthday">생일</label>
                <input type="text" id="birthday" name="birthday" value={saveData.birthday} onChange={handleChange} />
            </div>
            <AddressForm saveData={saveData} setSaveData={setSaveData}/>
            <button onClick={handleSubmit}>저장</button>
        </form>
    );
}

export default Save;
import React, {useState} from 'react';
import AddressForm from "./AddressForm.jsx";
import {postSave} from "../../api/authApi.js";

const initState = {
    name: '',
    username: '',
    password: '',
    passwordCheck: '',
    email: '',
    birthdate: '',
    address: {
        zonecode: '',
        roadAddress: '',
        jibunAddress: '',
        detailAddress: ''
    }
}

function Save(props) {

    const [saveData, setSaveData] = useState(initState)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSaveData({...saveData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(saveData);
        try{
            const response = await postSave(saveData)
            console.log(response.data);
        }catch (error){
            console.log(error);
        }

    }


    return (
        <form>
            <div>
                <label htmlFor="email">이메일</label>
                <input type="text" id="email" name="email" value={saveData.email} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="password">비밀번호</label>
                <input type="password" id="password" name="password" value={saveData.password} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="passwordCheck">비밀번호확인</label>
                <input type="password" id="passwordCheck" name="passwordCheck" value={saveData.passwordCheck} onChange={handleChange} />
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
                <label htmlFor="birthdate">생일</label>
                <input type="date" id="birthdate" name="birthdate" value={saveData.birthdate} onChange={handleChange} />
            </div>
            <AddressForm saveData={saveData} setSaveData={setSaveData}/>
            <button onClick={handleSubmit}>저장</button>
        </form>
    );
}

export default Save;
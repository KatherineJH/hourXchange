import React, {useEffect, useState} from 'react';
import {getList} from "../../api/categoryApi.js";
import {postSave} from "../../api/productApi.js";
import GoogleSaveMap from "../common/GoogleSaveMap.jsx";
import {useNavigate} from "react-router-dom";

const initState = {
    title: '',
    description: '',
    hours: '',
    startedAt: '',
    endAt: '',
    // ownerId: '', 서버의 토큰 값 적용
    categoryId: '',
    providerType: '',
    images: [], // 클라우드 연동 후 저장
    lat: 37.496486063, // 위도 가로
    lng: 127.028361548 // 경도 세로
}

function Save() {

    const navigate = useNavigate();

    const [saveData, setSaveData] = useState(initState);

    const [categoryData, setCategoryData] = useState([]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSaveData({...saveData, [name]: value});
    }

    useEffect(() => {
        getList().then(response => {
            setCategoryData(response.data);

        }).catch(error => console.log(error));
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(saveData);
        try {
            const response = await postSave(saveData);
            console.log(response);
            navigate("/serviceProduct/read/"+response.data.id)
        }catch (error) {
            console.log(error);
        }
    }


    return (

        <form>
            <h2>등록</h2>
            <div>
                <label htmlFor="title">제목</label>
                <input type="text" id="title" name="title"
                       value={saveData.title} onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="description">설명</label>
                <textarea id="description" name="description"
                          value={saveData.description} onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="hours">시간(비용)</label>
                <input type="number" id="hours" name="hours"
                       value={saveData.hours} onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="startedAt"></label>
                <input type="datetime-local" id="startedAt" name="startedAt"
                       value={saveData.startedAt} onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="endAt"></label>
                <input type="datetime-local" id="endAt" name="endAt"
                       value={saveData.endAt} onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="categoryId"></label>
                <select id="categoryId" name="categoryId"
                        value={saveData.categoryId} onChange={handleChange}
                >
                    <option value="">---카테고리---</option>
                    {categoryData.map((item) => (
                        <option key={item.id} value={item.id}>{item.categoryName}</option>

                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="providerType"></label>
                <select id="providerType" name="providerType"
                        value={saveData.providerType} onChange={handleChange}
                >
                    <option value="">---타입---</option>
                    <option value="BUYER">구매</option>
                    <option value="SELLER">판매</option>
                </select>
            </div>
            <GoogleSaveMap saveData={saveData} setSaveData={setSaveData}/>
            <button
                onClick={handleSubmit}
            >저장</button>
        </form>
    );
}

export default Save;
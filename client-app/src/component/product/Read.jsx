import React, {useEffect, useState} from 'react';
import {getRead} from "../../api/productApi.js";
import {useParams} from "react-router-dom";
import {postSave} from "../../api/transactionApi.js";

const initState = {
    id: '',
    title: '',
    description: '',
    hours: '',
    startedAt: '',
    endAt: '',
    owner: {},
    category: {},
    providerType: '',
    images: []
}

const saveDataInitState = {
    productId: '',
    status: ''
}

function Read() {

    const [serverData, setServerData] = useState(initState);

    const {id} = useParams();

    useEffect(() => {
            getRead(id).then(response => {
                setServerData(response.data)

            }).catch(error => console.log(error))
    }, [id]);

    const onClickSubmit = async (e) => {
        e.preventDefault();
        const saveData = {productId: serverData.id, status: "PENDING"};

        try{
            const response = await postSave(saveData);
            console.log(response);
        }catch(error){
            console.log(error)
        }



    }


    return (
        <div>
            <h2>조회</h2>
            <pre>{JSON.stringify(serverData, null, 2)}</pre>
            <button
                onClick={onClickSubmit}
            >신청</button>
        </div>
    );
}

export default Read;
import React, {useEffect, useState} from 'react';
import {getList} from "../../api/serviceProductApi.js";

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

function List() {

    const [serverDataList, setServerDataList] = useState([]);

    useEffect(() => {
        getList().then(response => {
            setServerDataList(response.data);
        }).catch(error => console.log(error));
    }, []);


    return (
        <div>
            <h2>리스트</h2>
            <pre>{JSON.stringify(serverDataList, null, 2)}</pre>
        </div>
    );
}

export default List;
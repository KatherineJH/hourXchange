import React, {useEffect, useState} from 'react';
import {getList} from "../../api/transactionApi.js";

const initState = {
    id: '',
    user: '',
    product: '',
    status: '',
    createAt: ''
}

function List(props) {

    const [serverDataList, setServerDataList] = useState([]);

    useEffect(() => {
        getList().then(response => {
            setServerDataList(response.data);
        }).catch(error => {
            console.log(error);
        })
    },[])

    return (
        <pre>{JSON.stringify(serverDataList, null, 2)}</pre>
    );
}

export default List;
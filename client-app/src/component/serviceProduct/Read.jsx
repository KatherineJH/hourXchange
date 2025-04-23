import React, {useEffect, useState} from 'react';
import {getRead} from "../../api/serviceProductApi.js";
import {useParams} from "react-router-dom";

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

function Read() {

    const [serverData, setServerData] = useState(initState);

    const {id} = useParams();

    useEffect(() => {
            getRead(id).then(response => {
                setServerData(response.data)
            }).catch(error => console.log(error))
    }, [id]);


    return (
        <div>
            <h2>조회</h2>
            <pre>{JSON.stringify(serverData, null, 2)}</pre>
        </div>
    );
}

export default Read;
import React, {useEffect, useState} from 'react';
import {readGet} from "../../api/serviceProductApi.jsx";
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

function Read(props) {

    const [serverData, setServerData] = useState(initState);

    const {id} = useParams();

    useEffect(() => {
            readGet(id).then(response => {
                console.log(response);
                setServerData(response)
            }).catch(error => console.log(error))
    }, [id]);


    return (
        <div>
            {serverData.owner.name}
        </div>
    );
}

export default Read;
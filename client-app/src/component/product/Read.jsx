import React, {useEffect, useState} from 'react';
import {getRead} from "../../api/productApi.js";
import {useNavigate, useParams} from "react-router-dom";
import {postSave} from "../../api/transactionApi.js";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Grid, Button
} from "@mui/material";
import GoogleReadMap from "../common/GoogleReadMap.jsx";
import {useSelector} from "react-redux";

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
    images: [],
    lat: '',
    lng: ''
}

const saveDataInitState = {
    productId: '',
    status: ''
}
const IMAGE_SIZE = 300; // 이미지 썸네일 크기(px)


function Read() {

    const [serverData, setServerData] = useState(initState);

    const auth = useSelector(state => state.auth);

    const navigate = useNavigate();

    const {id} = useParams();

    useEffect(() => {
            getRead(id).then(response => {
                setServerData(response.data)
                console.log(response.data);

            }).catch(error => console.log(error))
    }, [id]);

    const onClickSubmit = async (e) => {
        e.preventDefault();
        const saveData = {productId: serverData.id, status: "PENDING"};

        try{
            const response = await postSave(saveData);
            console.log(response);

            navigate('/chat-room/' + response.data.chatRoomId);
        }catch(error){
            console.log(error)
        }
    }


    return (
        <Box sx={{ mt: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        상세정보
                    </Typography>

                    <Divider sx={{ my: 2 }} />
                    {/* 이미지 썸네일 행 */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        {serverData.images?.map((url, idx) => (
                            <Box
                                key={idx}
                                component="img"
                                src={url}
                                alt={`preview-${idx}`}
                                sx={{
                                    width: IMAGE_SIZE,
                                    height: IMAGE_SIZE,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid rgba(0,0,0,0.1)'
                                }}
                            />
                        ))}
                    </Box>


                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                제목
                            </Typography>
                            <Typography variant="body1">
                                {serverData.title || "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                설명
                            </Typography>
                            <Typography variant="body1"
                                        sx={{
                                            minHeight: 120,  // ✅ 설명 기본 높이 설정
                                            whiteSpace: 'pre-wrap' // 줄바꿈 유지
                                        }}
                            >
                                {serverData.description || "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                시간(비용)
                            </Typography>
                            <Typography variant="body1">
                                {serverData.hours ? `${serverData.hours} 시간` : "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                타입
                            </Typography>
                            <Typography variant="body1">
                                {serverData.providerType === "BUYER" ? "구매" : serverData.providerType === "SELLER" ? "판매" : "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                시작 시간
                            </Typography>
                            <Typography variant="body1">
                                {serverData.startedAt || "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                종료 시간
                            </Typography>
                            <Typography variant="body1">
                                {serverData.endAt || "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                카테고리
                            </Typography>
                            <Typography variant="body1">
                                {/*{getCategoryName(serverData.categoryId)}*/}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                위치
                            </Typography>
                            <GoogleReadMap serverData={serverData} setSaveData={() => {}} viewOnly />
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={onClickSubmit}
                            >
                                채팅하기
                            </Button>
                        </Grid>

                        {auth.user?.id === serverData.owner.id ?<>
                            <Grid item xs={6} sx={{ textAlign: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => navigate(`/product/modify/${serverData.id}`)}
                                >
                                    수정하기
                                </Button>
                            </Grid></> : <></>
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Read;
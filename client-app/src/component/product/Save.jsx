import React, {useEffect, useRef, useState} from 'react';
import {getList} from "../../api/categoryApi.js";
import {postSave} from "../../api/productApi.js";
import GoogleSaveMap from "../common/GoogleSaveMap.jsx";
import {useNavigate} from "react-router-dom";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import axios from "axios";

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

const IMAGE_SIZE = 300; // 정사각형 크기(px)

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

        let addImageData

        try {
            // 1) Cloudinary 업로드
            const uploadPromises = images.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', `${import.meta.env.VITE_UPLOAD_PRESET}`); // 본인 preset

                return axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, // 본인 cloud_name
                    formData
                ).then(res => res.data.secure_url);
            });

            // 모든 업로드 완료 후 URL 배열 얻기
            const imageUrls = await Promise.all(uploadPromises);
            console.log('Cloudinary URLs:', imageUrls);

            addImageData = {...saveData, images: imageUrls};

            //필요 시 form 초기화 로직 작성
        } catch (error) {
            console.error('업로드 오류:', error);
            alert('이미지 업로드 또는 저장 중 오류 발생');
        }


        console.log(addImageData);
        try {
            const response = await postSave(addImageData);
            console.log(response);
            navigate("/product/read/"+response.data.id)
        }catch (error) {
            console.log(error);
        }
    }

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    // 파일 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImages(prev => [...prev, file]);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);

        // 선택 후 input 값 초기화 (동일 파일 재선택 가능하게)
        e.target.value = null;
    };

    const handleAddClick = () => {
        fileInputRef.current.click();
    };

    // const handleSubmit = async () => {
    //     // Cloudinary 업로드 및 서버 전송 로직
    //     // (생략: 이전 예시 코드 참고)
    // };

    // 이미지 삭제 핸들러
    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };


    return (
        <Box sx={{ mt: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        등록
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>

                        {/* 이미지 행 */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            {previews.map((src, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={src}
                                    alt={`preview-${idx}`}
                                    onClick={() => handleRemoveImage(idx)}
                                    sx={{
                                        width: IMAGE_SIZE,
                                        height: IMAGE_SIZE,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                            ))}

                            {/* 추가 버튼 */}
                            <Button
                                variant="outlined"
                                onClick={handleAddClick}
                                sx={{
                                    width: IMAGE_SIZE,
                                    height: IMAGE_SIZE,
                                    minWidth: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    border: '1px dashed rgba(0,0,0,0.3)'
                                }}
                            >
                                <AddPhotoAlternateIcon />
                            </Button>

                            {/* 숨겨진 파일 입력 */}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                        </Box>
                        {/* 제목 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                제목
                            </Typography>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                value={saveData.title}
                                onChange={handleChange}
                                placeholder="제목을 입력하세요"
                                margin="normal"
                            />
                        </Grid>

                        {/* 설명 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                설명
                            </Typography>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                multiline
                                rows={4}
                                value={saveData.description}
                                onChange={handleChange}
                                placeholder="설명을 입력하세요"
                                margin="normal"
                                sx={{
                                    minHeight: 120,
                                    whiteSpace: 'pre-wrap'
                                }}
                            />
                        </Grid>

                        {/* 시간(비용) */}
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                시간(비용)
                            </Typography>
                            <TextField
                                fullWidth
                                id="hours"
                                name="hours"
                                type="number"
                                value={saveData.hours}
                                onChange={handleChange}
                                placeholder="시간 입력"
                                margin="normal"
                            />
                        </Grid>

                        {/* 타입 */}
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                타입
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="providerType-label">타입</InputLabel>
                                <Select
                                    labelId="providerType-label"
                                    id="providerType"
                                    name="providerType"
                                    value={saveData.providerType}
                                    label="타입"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">---타입---</MenuItem>
                                    <MenuItem value="BUYER">구매</MenuItem>
                                    <MenuItem value="SELLER">판매</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 시작 시간 */}
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                시작 시간
                            </Typography>
                            <TextField
                                fullWidth
                                id="startedAt"
                                name="startedAt"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={saveData.startedAt}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>

                        {/* 종료 시간 */}
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                종료 시간
                            </Typography>
                            <TextField
                                fullWidth
                                id="endAt"
                                name="endAt"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={saveData.endAt}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>

                        {/* 카테고리 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                카테고리
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="categoryId-label">카테고리</InputLabel>
                                <Select
                                    labelId="categoryId-label"
                                    id="categoryId"
                                    name="categoryId"
                                    value={saveData.categoryId}
                                    label="카테고리"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">---카테고리---</MenuItem>
                                    {categoryData.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 지도 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                위치
                            </Typography>
                            <GoogleSaveMap saveData={saveData} setSaveData={setSaveData} />
                        </Grid>

                        {/* 저장 버튼 */}
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleSubmit}
                            >
                                저장
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Save;
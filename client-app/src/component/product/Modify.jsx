import React, { useEffect, useRef, useState } from 'react';
import { getList } from '../../api/categoryApi.js';
import { getRead, putUpdate } from '../../api/productApi.js';
import { useNavigate, useParams } from 'react-router-dom';

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
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from "axios";
import {useSelector} from "react-redux";

const initState = {
    title: '',
    description: '',
    hours: '',
    startedAt: '',
    endAt: '',
    ownerId: '',
    owner: {},
    categoryId: '',
    category: {},
    providerType: '',
    images: []
};

const IMAGE_SIZE = 300;

function Modify() {
    const navigate = useNavigate();
    const { id } = useParams();
    const auth = useSelector(state => state.auth);

    const [updateData, setUpdateData] = useState(initState);
    const [categoryData, setCategoryData] = useState([]);

    // 로컬 파일/미리보기 관리
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    // 서버에서 받아온 이미지 URL을 first load
    useEffect(() => {
        getRead(id)
            .then(response => {
                if(auth.user?.id !== response.data.owner.id) {
                    alert('본인이 등록한 제품만 수정이 가능합니다.')
                    navigate('/')
                }
                const data = response.data;
                setUpdateData({
                    ...data,
                    categoryId: data.category.id,
                    ownerId: data.owner.id
                });
                setPreviews(data.images || []);
            })
            .catch(console.log);

        getList()
            .then(response => setCategoryData(response.data))
            .catch(console.log);
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setUpdateData(prev => ({ ...prev, [name]: value }));
    };

    // 파일 선택
    const handleAddClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewFiles(prev => [...prev, file]);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    // 이미지 삭제
    const handleRemoveImage = index => {
        // 기존 URL 삭제
        setUpdateData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));

        // 파일/preview 삭제
        setNewFiles(prev => {
            const urlCount = updateData.images.length;
            if (index >= urlCount) {
                // 신규 파일 삭제
                return prev.filter((_, i) => i !== index - urlCount);
            }
            return prev;
        });
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // 업데이트 제출
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            // 신규 파일만 Cloudinary 업로드
            const urlPromises = newFiles.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'fikklc42');
                return axios
                    .post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, formData)
                    .then(res => res.data.secure_url);
            });
            const newUrls = await Promise.all(urlPromises);

            // 최종 이미지 URL 목록: 기존 + 신규
            const finalImages = [...updateData.images, ...newUrls];

            // 업데이트 payload
            const payload = { ...updateData, images: finalImages };
            const response = await putUpdate(id, payload);
            navigate('/product/read/' + response.data.id);
        } catch (error) {
            console.error(error);
            alert('수정 중 오류 발생');
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        수정
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {/* 이미지 미리보기 및 추가 */}
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
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
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
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </Box>

                    <Grid container spacing={2}>
                        {/* 제목 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                제목
                            </Typography>
                            <TextField
                                fullWidth
                                name="title"
                                value={updateData.title}
                                onChange={handleChange}
                                placeholder="제목을 입력하세요"
                                margin="normal"
                            />
                        </Grid>
                        {/* 이하 기존 필드 동일 */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                설명
                            </Typography>
                            <TextField
                                fullWidth
                                name="description"
                                multiline
                                rows={4}
                                value={updateData.description}
                                onChange={handleChange}
                                placeholder="설명을 입력하세요"
                                margin="normal"
                                sx={{ minHeight: 120, whiteSpace: 'pre-wrap' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                시간(비용)
                            </Typography>
                            <TextField
                                fullWidth
                                name="hours"
                                type="number"
                                value={updateData.hours}
                                onChange={handleChange}
                                placeholder="시간 입력"
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                타입
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="providerType-label">타입</InputLabel>
                                <Select
                                    labelId="providerType-label"
                                    name="providerType"
                                    value={updateData.providerType}
                                    label="타입"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">---타입---</MenuItem>
                                    <MenuItem value="BUYER">구매</MenuItem>
                                    <MenuItem value="SELLER">판매</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                시작 시간
                            </Typography>
                            <TextField
                                fullWidth
                                name="startedAt"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={updateData.startedAt}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                종료 시간
                            </Typography>
                            <TextField
                                fullWidth
                                name="endAt"
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                value={updateData.endAt}
                                onChange={handleChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                                카테고리
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="categoryId-label">카테고리</InputLabel>
                                <Select
                                    labelId="categoryId-label"
                                    name="categoryId"
                                    value={updateData.categoryId}
                                    label="카테고리"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">---카테고리---</MenuItem>
                                    {categoryData.map(item => (
                                        <MenuItem key={item.id} value={item.id}> {item.categoryName} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleSubmit}
                            >
                                수정하기
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Modify;

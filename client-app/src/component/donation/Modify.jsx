// src/components/DonationEdit.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDonation, putUpdateDonation } from '../../api/donationApi.js';
import uploadToCloudinary from '../../assets/uploadToCloudinary';

export default function DonationEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [form, setForm] = useState({
        purpose: '',
        targetAmount: '',
        title: '',
        description: '',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    });
    const imageSize = 150;
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const readPath = pathname.startsWith('/admin')
        ? `/admin/donation/read/${id}`
        : `/donation/read/${id}`;
    const listPath = pathname.startsWith('/admin')
        ? '/admin/donation/list'
        : '/donation/list';

    useEffect(() => {
        async function fetch() {
            try {
                const res = await getDonation(id);
                const d = res.data;
                setForm({
                    purpose: d.purpose,
                    targetAmount: d.targetAmount.toString(),
                    title: d.title,
                    description: d.description,
                    startDate: dayjs(d.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(d.endDate).format('YYYY-MM-DD'),
                });
                setImages(d.images || []);
            } catch (err) {
                console.error(err);
                alert('데이터 로드 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleStartDate = newDate => {
        if (newDate.isAfter(dayjs(form.endDate))) {
            alert('시작일은 종료일 이전이어야 합니다.');
            return;
        }
        setForm(prev => ({ ...prev, startDate: newDate.format('YYYY-MM-DD') }));
    };

    const handleEndDate = newDate => {
        if (newDate.isBefore(dayjs(form.startDate))) {
            alert('종료일은 시작일 이후여야 합니다.');
            return;
        }
        setForm(prev => ({ ...prev, endDate: newDate.format('YYYY-MM-DD') }));
    };

    const handleImageUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;
        if (images.length >= 3) {
            alert('이미지는 최대 3장까지 등록이 가능합니다.');
            return;
        }
        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);
            setImages(prev => [...prev, url]);
        } catch (err) {
            console.error('이미지 업로드 실패', err);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = idx => {
        if (window.confirm('정말 이 사진을 삭제하시겠습니까?')) {
            setImages(prev => prev.filter((_, i) => i !== idx));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const data = {
                purpose: form.purpose,
                targetAmount: parseInt(form.targetAmount, 10),
                title: form.title,
                description: form.description,
                startDate: form.startDate,
                endDate: form.endDate,
                images,
            };
            await putUpdateDonation(id, data);
            alert('모금 정보가 수정되었습니다.');
            navigate(readPath);
        } catch (err) {
            console.error(err);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                로딩 중...
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    기부 모금 수정
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <form onSubmit={handleSubmit}>
                    {/* 이미지 업로드 (가로 스크롤) */}
                    <Box sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: 1,
                                p: 1,
                            }}
                        >
                            <Button
                                component="label"
                                variant="outlined"
                                sx={{
                                    width: imageSize,
                                    height: imageSize,
                                    borderRadius: 2,
                                    flex: '0 0 auto',
                                }}
                            >
                                <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Button>

                            {images.map((url, idx) => (
                                <Box
                                    key={idx}
                                    onClick={() => handleDeleteImage(idx)}
                                    sx={{
                                        width: imageSize,
                                        height: imageSize,
                                        border: 1,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        flex: '0 0 auto',
                                    }}
                                >
                                    <img
                                        src={url}
                                        alt={`업로드된 이미지 ${idx}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ))}

                            {uploading && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        pl: 1,
                                        flex: '0 0 auto',
                                    }}
                                >
                                    <CircularProgress size={24} />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* 나머지 입력 폼 */}
                    <TextField
                        label="제목"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="설명"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="모집 목표액(시간)"
                        name="targetAmount"
                        type="number"
                        value={form.targetAmount}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="모집 목적"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                mt: 2,
                                mb: 3,
                                justifyContent: 'space-between',
                            }}
                        >
                            <DatePicker
                                label="시작일"
                                value={dayjs(form.startDate)}
                                onChange={handleStartDate}
                                renderInput={params => <TextField {...params} fullWidth required />}
                            />
                            <DatePicker
                                label="종료일"
                                value={dayjs(form.endDate)}
                                onChange={handleEndDate}
                                renderInput={params => <TextField {...params} fullWidth required />}
                            />
                        </Box>
                    </LocalizationProvider>

                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                            수정 완료
                        </Button>
                        <Button sx={{ ml: 1 }} onClick={() => navigate(listPath)}>
                            취소
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

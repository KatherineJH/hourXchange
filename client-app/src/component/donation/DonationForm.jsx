// src/components/DonationForm.jsx
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { postDonation } from '../../api/donationApi.js'; // axios 기반 API 호출 함수
import {useLocation, useNavigate} from 'react-router-dom';

export default function DonationForm() {
    const [form, setForm] = useState({
        purpose: '',
        targetAmount: '',
        title: '',
        description: '',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    });
    const navigate = useNavigate();

    const { pathname } = useLocation();              // 현재 경로

    const readPath = pathname.startsWith('/admin')
        ? '/admin/donation/read/'
        : '/donation/read/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleStartDate = (newDate) => {
        if (newDate && newDate.isAfter(dayjs(form.endDate))) {
            alert('시작일은 종료일 이전이어야 합니다.');
            return;
        }
        setForm(prev => ({ ...prev, startDate: newDate.format('YYYY-MM-DD') }));
    };

    const handleEndDate = (newDate) => {
        if (newDate && newDate.isBefore(dayjs(form.startDate))) {
            alert('종료일은 시작일 이후여야 합니다.');
            return;
        }
        setForm(prev => ({ ...prev, endDate: newDate.format('YYYY-MM-DD') }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                targetAmount: parseInt(form.targetAmount, 10),
            };
            const res = await postDonation(payload);
            alert('모금 정보가 저장되었습니다.');
            navigate(`${readPath}${res.data.id}`);
        } catch (err) {
            console.error(err);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    기부 모금 등록
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="모집 목적"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        fullWidth
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
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
                            <DatePicker
                                label="모집 시작일"
                                value={dayjs(form.startDate)}
                                onChange={handleStartDate}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                            <DatePicker
                                label="모집 종료일"
                                value={dayjs(form.endDate)}
                                onChange={handleEndDate}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </Box>
                    </LocalizationProvider>

                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={<SendIcon />}
                        >
                            등록
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

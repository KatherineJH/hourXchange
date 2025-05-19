// src/components/DonationEdit.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDonation, putUpdateDonation } from '../../api/donationApi.js';

export default function Modify() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [form, setForm] = useState({
        purpose: '',
        targetAmount: '',
        title: '',
        description: '',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(7, 'day').format('YYYY-MM-DD')
    });
    const [loading, setLoading] = useState(true);

    // Determine navigation paths
    const readPath = pathname.startsWith('/admin')
        ? `/admin/donation/read/${id}`
        : `/donation/read/${id}`;
    const listPath = pathname.startsWith('/admin')
        ? '/admin/donation/list'
        : '/donation/list';

    // Load existing donation
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
                    endDate: dayjs(d.endDate).format('YYYY-MM-DD')
                });
            } catch (err) {
                console.error(err);
                alert('데이터 로드 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleStartDate = (newDate) => {
        if (newDate.isAfter(dayjs(form.endDate))) {
            alert('시작일은 종료일 이전이어야 합니다.');
            return;
        }
        setForm(prev => ({ ...prev, startDate: newDate.format('YYYY-MM-DD') }));
    };

    const handleEndDate = (newDate) => {
        if (newDate.isBefore(dayjs(form.startDate))) {
            alert('종료일은 시작일 이후여야 합니다.');
            return;
        }
        setForm(prev => ({ ...prev, endDate: newDate.format('YYYY-MM-DD') }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                purpose: form.purpose,
                targetAmount: parseInt(form.targetAmount, 10), // 10진수로 변환
                title: form.title,
                description: form.description,
                startDate: form.startDate,
                endDate: form.endDate
            };
            const response = await putUpdateDonation(id, data);
            console.log(response)
            alert('모금 정보가 수정되었습니다.');
            navigate(readPath);
        } catch (err) {
            console.error(err);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <Typography align="center" sx={{ mt: 4 }}>로딩 중...</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    기부 모금 수정
                </Typography>
                <Divider sx={{ mb: 2 }} />
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
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
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

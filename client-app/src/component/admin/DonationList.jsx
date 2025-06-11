import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import CustomPagination from "../common/CustomPagination.jsx";
import {getSearch, putEndDonation, putCancelDonation, putCompleteDonation, putUpdateDonationProof} from "../../api/donationApi.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import {useNavigate} from "react-router-dom";

const initParams = {
    donationId: '',
    title: '',
    description: '',
    status: '',
    startDate: null,
    endDate: null
}

export default function DonationList() {
    const navigate = useNavigate();
    const [serverData, setServerData] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [params, setParams] = useState(initParams);

    // 증빙용 상태
    const [evidenceOpen, setEvidenceOpen] = useState(false);
    const [currentEvidenceId, setCurrentEvidenceId] = useState(null);
    const [currentEvidenceUrl, setCurrentEvidenceUrl] = useState(null);
    const [evidenceFiles, setEvidenceFiles] = useState([]);
    const [evidencePreviews, setEvidencePreviews] = useState([]);
    const [uploadingEvidence, setUploadingEvidence] = useState(false);

    const getSearchFunction = async () => {
        try{
            const formattedParams = {
                ...params,
                startDate: params.startDate?.format('YYYY-MM-DD') ?? null,
                endDate:   params.endDate?.format('YYYY-MM-DD')   ?? null,
            };
            const response = await getSearch(page, size, formattedParams);
            setServerData(response.data.content);
            setTotalPages(response.data.totalPages);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getSearchFunction();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        getSearchFunction();
    }

    const handleEnd = async (id) => {
        try {
            if(!confirm('완료 처리하시겠습니까?')) return;
            await putEndDonation(id);
            alert('완료 처리되었습니다.');
            getSearchFunction();
        }catch(error){
            alert(error.response?.data?.message || '오류가 발생했습니다.');
        }
    }

    const handleCancel = async (id) => {
        try {
            if(!confirm('취소하시겠습니까?')) return;
            await putCancelDonation(id);
            alert('취소되었습니다.');
            getSearchFunction();
        }catch(error){
            alert(error.response?.data?.message || '오류가 발생했습니다.');
        }
    }

    // 증빙 버튼 클릭 → 다이얼로그 오픈
    const handleEvidenceClick = (id) => {
        const item = serverData.find(i => i.id === id);
        setCurrentEvidenceId(id);
        if (item && item.proofUrl) {
            setCurrentEvidenceUrl(item.proofUrl);
            setEvidencePreviews([item.proofUrl]);
            setEvidenceFiles([]);
        } else {
            setCurrentEvidenceUrl(null);
            setEvidencePreviews([]);
            setEvidenceFiles([]);
        }
        setEvidenceOpen(true);
    };

    // 파일 선택 시 프리뷰 생성
    const handleEvidenceFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setEvidenceFiles([file]);
        setEvidencePreviews([URL.createObjectURL(file)]);
    };

    // 증빙 제출
    const handleEvidenceSubmit = async () => {
        if (!currentEvidenceUrl && evidenceFiles.length === 0) {
            return alert('사진을 선택해주세요.');
        }
        try {
            setUploadingEvidence(true);
            let urlToSend = currentEvidenceUrl;
            if (evidenceFiles.length > 0) {
                urlToSend = await uploadToCloudinary(evidenceFiles[0]);
            }
            await putCompleteDonation(currentEvidenceId, urlToSend);
            alert('증빙되었습니다.');
            setEvidenceOpen(false);
            getSearchFunction();
        } catch (error) {
            alert(error.response?.data?.message || '증빙 처리에 실패했습니다.');
        } finally {
            setUploadingEvidence(false);
        }
    };

    const handleEvidenceUpdate = async () => {
        if (evidenceFiles.length === 0) {
            return alert('새로운 사진을 선택해주세요.');
        }
        try {
            setUploadingEvidence(true);
            const urlToSend = await uploadToCloudinary(evidenceFiles[0]);
            await putUpdateDonationProof(currentEvidenceId, urlToSend);
            alert('증빙이 수정되었습니다.');
            setEvidenceOpen(false);
            getSearchFunction();
        } catch (error) {
            alert(error.response?.data?.message || '수정 처리에 실패했습니다.');
        } finally {
            setUploadingEvidence(false);
        }
    };

    // 입력 핸들러
    const handleChange = e => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                기부모집조회
            </Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ width: '100%', mb: 2 }}
            >
                {/* 1st row: 제목, 설명 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                        fullWidth
                        name="donationId"
                        label="기부모집ID"
                        value={params.donationId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="title"
                        label="제목"
                        value={params.title}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="description"
                        label="설명"
                        value={params.description}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                </Box>

                {/* 2nd row: 시작일, 종료일, 상태, 검색 버튼 */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            name="startDate"
                            label="시작일"
                            value={params.startDate}
                            onChange={value => handleChange({ target: { name: 'startDate', value } })}
                            format="YYYY-MM-DD"
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ flexGrow: 1 }}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            name="endDate"
                            label="종료일"
                            value={params.endDate}
                            onChange={value => handleChange({ target: { name: 'endDate', value } })}
                            format="YYYY-MM-DD"
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ flexGrow: 1 }}
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
                        <InputLabel>상태</InputLabel>
                        <Select
                            name="status"
                            label="상태"
                            value={params.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">전체</MenuItem>
                            <MenuItem value="ONGOING">진행중</MenuItem>
                            <MenuItem value="ENDED">종료</MenuItem>
                            <MenuItem value="COMPLETED">완료</MenuItem>
                            <MenuItem value="CANCELLED">취소</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ flexGrow: 1, minWidth: 120 }}
                    >
                        검색
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>사진</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>설명</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>모집시간</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>시작시간</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>끝시간</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>취소</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>종료</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>증빙</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {serverData.length > 0 ? (
                            serverData.map((item) => {
                                const progress = Math.min(
                                    (item.currentAmount / item.targetAmount) * 100,
                                    100
                                );
                                return (
                                    <TableRow
                                        hover
                                        key={item.id}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/admin/donation/read/${item.id}`)}
                                    >
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>
                                            <CardMedia
                                                component="img"
                                                image={item.images[0] ?? '/default.png'}
                                                alt={item.title}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell sx={{ width: 200 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {`${item.currentAmount} / ${item.targetAmount}`}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.startDate}</TableCell>
                                        <TableCell>{item.endDate}</TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancel(item.id)
                                                }}
                                            >취소</Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEnd(item.id)
                                                }}
                                            >종료</Button>
                                        </TableCell>
                                        <TableCell>
                                            {item.proofUrl ? (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <CardMedia
                                                        component="img"
                                                        src={item.proofUrl}
                                                        alt="증빙 이미지"
                                                        sx={{
                                                            width: 100,
                                                            height: 100,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEvidenceClick(item.id)
                                                        }}
                                                    />
                                                    <Button
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEvidenceClick(item.id)
                                                        }}
                                                        sx={{ mt: 0.5 }}
                                                    >수정</Button>
                                                </Box>
                                            ) : (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEvidenceClick(item.id)
                                                    }}
                                                >증빙</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    등록된 정보가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
            {/* 증빙 사진 업로드 다이얼로그 */}
            <Dialog
                open={evidenceOpen}
                onClose={() => setEvidenceOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>증빙 사진 첨부</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <input
                            hidden
                            accept="image/*"
                            id="evidence-files"
                            type="file"
                            onChange={handleEvidenceFileChange}
                        />
                        <label htmlFor="evidence-files">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<AddPhotoAlternateIcon />}
                                disabled={uploadingEvidence}
                            >
                                사진 선택
                            </Button>
                        </label>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {evidencePreviews.map((src, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={src}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setEvidenceOpen(false)}
                        disabled={uploadingEvidence}
                    >
                        취소
                    </Button>
                    {currentEvidenceUrl ? (
                        <Button
                            onClick={handleEvidenceUpdate}
                            variant="contained"
                            disabled={uploadingEvidence}
                        >
                            수정
                        </Button>
                    ) : (
                        <Button
                            onClick={handleEvidenceSubmit}
                            variant="contained"
                            disabled={uploadingEvidence}
                        >
                            확인
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

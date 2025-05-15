import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRead, putUpdate } from "../../api/productApi.js";
import { getList as getCategoryList } from "../../api/categoryApi.js";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import KakaoSaveMap from "../common/KakaoSaveMap.jsx";

const IMAGE_SIZE = 150;

const Modify = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const auth = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        hours: 0,
        providerType: "",
        categoryId: "",
        startedAt: dayjs().add(30, "minute"),
        endAt: dayjs().add(2, "hour"),
        images: [],
        lat: '',
        lng: '',
        address: {},
    });
    const [categories, setCategories] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        getRead(id).then(res => {
            const d = res.data;
            if (auth.user?.id !== d.owner.id) {
                alert("본인이 등록한 상품만 수정할 수 있습니다.");
                return navigate(-1);
            }
            setFormData({
                title: d.title,
                description: d.description,
                hours: d.hours,
                providerType: d.providerType,
                categoryId: d.category.id,
                startedAt: dayjs(d.startedAt),
                endAt: dayjs(d.endAt),
                images: d.images || [],
                lat: d.lat,
                lng: d.lng,
                address: d.address || {},
            });
            setPreviews(d.images || []);
        });
        getCategoryList().then(res => setCategories(res.data));
    }, [id]);

    const handleFieldChange = e => {
        const { name, value } = e.target;
        if (name === "hours") {
            const num = parseInt(value, 10);
            setFormData(prev => ({ ...prev, hours: isNaN(num) ? 0 : num }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = field => newVal => {
        if (field === "startedAt" && newVal.isAfter(formData.endAt)) {
            alert("시작 시간은 종료 시간 이전이어야 합니다.");
            return;
        }
        if (field === "endAt" && newVal.isBefore(formData.startedAt)) {
            alert("종료 시간은 시작 시간 이후이어야 합니다.");
            return;
        }
        setFormData(prev => ({ ...prev, [field]: newVal }));
    };

    const handleAddClick = () => fileInputRef.current.click();
    const handleImageChange = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewFiles(prev => [...prev, file]);
        const reader = new FileReader();
        reader.onloadend = () => setPreviews(prev => [...prev, reader.result]);
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const handleRemoveImage = idx => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
        const urlCount = formData.images.length;
        if (idx >= urlCount) {
            setNewFiles(prev => prev.filter((_, i) => i !== idx - urlCount));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const uploads = newFiles.map(file => {
                const fd = new FormData();
                fd.append("file", file);
                fd.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
                return axios
                    .post(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
                        fd
                    )
                    .then(r => r.data.secure_url);
            });
            const newUrls = await Promise.all(uploads);
            const finalImages = [...formData.images, ...newUrls];

            const payload = {
                ...formData,
                startedAt: formData.startedAt.format("YYYY-MM-DDTHH:mm:ss"),
                endAt:     formData.endAt.    format("YYYY-MM-DDTHH:mm:ss"),
                images: finalImages,
            };
            console.log(payload)
            await putUpdate(id, payload);
            navigate(`/product/read/${id}`);
        } catch (err) {
            console.error(err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
            <form onSubmit={handleSubmit}>
                {/* 이미지 */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {previews.map((src, idx) => (
                        <Box
                            key={idx}
                            sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE, cursor: "pointer" }}
                            onClick={() => handleRemoveImage(idx)}
                        >
                            <img
                                src={src}
                                alt={`img-${idx}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                            />
                        </Box>
                    ))}
                    <Button
                        variant="outlined"
                        onClick={handleAddClick}
                        sx={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 2, border: "1px dashed rgba(0,0,0,0.3)" }}
                    >
                        <AddPhotoAlternateIcon />
                    </Button>
                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
                </Box>

                {/* 타입 & 카테고리 */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>타입</InputLabel>
                        <Select name="providerType" value={formData.providerType} onChange={handleFieldChange}>
                            <MenuItem value="">---타입---</MenuItem>
                            <MenuItem value="BUYER">BUYER</MenuItem>
                            <MenuItem value="SELLER">SELLER</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel>카테고리</InputLabel>
                        <Select name="categoryId" value={formData.categoryId} onChange={handleFieldChange}>
                            <MenuItem value="">---카테고리---</MenuItem>
                            {categories.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.categoryName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* 제목 */}
                <TextField
                    fullWidth
                    label="제목"
                    name="title"
                    value={formData.title}
                    onChange={handleFieldChange}
                    margin="normal"
                />

                {/* 설명 */}
                <TextField
                    fullWidth
                    label="내용"
                    name="description"
                    value={formData.description}
                    onChange={handleFieldChange}
                    margin="normal"
                    multiline rows={4}
                />

                {/* 날짜 */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <DateTimePicker
                            label="시작 시간"
                            value={formData.startedAt}
                            onChange={handleDateChange('startedAt')}
                            renderInput={params => <TextField {...params} fullWidth />}
                        />
                        <DateTimePicker
                            label="종료 시간"
                            value={formData.endAt}
                            onChange={handleDateChange('endAt')}
                            renderInput={params => <TextField {...params} fullWidth />}
                        />
                    </Box>
                </LocalizationProvider>

                {/* 상품 시간 */}
                <TextField
                    fullWidth
                    label="상품 시간"
                    name="hours"
                    type="number"
                    value={formData.hours}
                    onChange={handleFieldChange}
                    margin="normal"
                />

                {/* 지도 수정 */}
                <Box sx={{ mb: 2 }}>
                    <KakaoSaveMap
                        saveData={formData}
                        setSaveData={setFormData}
                    />
                </Box>

                {/* 전송 */}
                <Box sx={{ textAlign: "right", mt: 2 }}>
                    <Button variant="contained" endIcon={<SendIcon />} type="submit">
                        수정하기
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Modify;
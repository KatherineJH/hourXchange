// filename change: Buy.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import IamportButton from '../common/IamportButton.jsx';
import { getList } from '../../api/paymentItemApi.js';
import { useSelector } from 'react-redux';
import {postOrder, postVerify} from "../../api/paymentApi.js";

export default function PackagePaymentScreen() {
    // 서버에서 받아올 패키지 리스트: [{ id, name, time, price }, ...]
    const [packages, setPackages] = useState([]);

    // 선택된 카드 인덱스
    const [selectedIdx, setSelectedIdx] = useState(null);

    // 결제 확인 모달 상태
    const [openModal, setOpenModal] = useState(false);
    const [modalPkg, setModalPkg] = useState(null);

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        getList()
            .then(response => setPackages(response.data))
            .catch(error => console.error('패키지 리스트 로드 실패', error));
    }, []);

    const handleModalClose = () => {
        setOpenModal(false);
        setModalPkg(null);
    };

    const handleModalConfirm = async (modalPkg) => {
        console.log(`결제 요청: ${modalPkg.name}, 금액: ${modalPkg.price}`);
        // TODO: 실제 결제 API 호출
        console.log(modalPkg)
        console.log(user)
        try{
            const merchantUid = `mid_${new Date().getTime()}`;
            const formData = {
                email: user.email,
                paymentItemName: modalPkg.name,
                paymentItemPrice: modalPkg.price,
                merchantUid: merchantUid, // 가맹점 주문번호
            }
            const orderResponse = await postOrder(formData); // 결제 서버로 생각
            console.log(orderResponse.data)

            const verifyResponse = await postVerify(orderResponse.data); // api 서버
            console.log(verifyResponse)
        }catch(error){
            console.log(error);
        }


        handleModalClose();
    };

    return (
        <Box sx={{ maxWidth: 960, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                시간 충전
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
                원하는 패키지를 선택하고 결제하세요.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {packages.map((pkg, idx) => {
                    const { id, name, time, price } = pkg;
                    const isSelected = selectedIdx === idx;
                    const orderId = `${id}_${Date.now()}`;

                    return (
                        <Grid key={id} item>
                            <Card
                                variant={isSelected ? 'elevation' : 'outlined'}
                                sx={{ width: 280, borderColor: isSelected ? 'primary.main' : undefined }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {typeof time === 'number' ? `${time}시간` : time}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body1">
                                        금액: <strong>{price.toLocaleString()}원</strong>
                                    </Typography>
                                </CardContent>

                                <CardActions>
                                    <Button
                                        fullWidth
                                        variant={isSelected ? 'contained' : 'outlined'}
                                        color="primary"
                                        onClick={() => setSelectedIdx(idx)}
                                    >
                                        {isSelected ? '선택됨' : '선택'}
                                    </Button>
                                </CardActions>

                                {isSelected && (
                                    <Box sx={{ p: 2 }}>
                                        {user.role === 'ROLE_ADMIN' ? (
                                            <IamportButton
                                                orderId={orderId}
                                                productName={name}
                                                amount={price}
                                            />
                                        ) : (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => {
                                                    setModalPkg(pkg);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                결제
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* 일반 유저 결제 확인 모달 */}
            <Dialog open={openModal} onClose={handleModalClose}>
                <DialogTitle>결제 확인</DialogTitle>
                <DialogContent>
                    <Typography>
                        패키지 "{modalPkg?.name}"을 {modalPkg?.price.toLocaleString()}원에 결제하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>취소</Button>
                    <Button variant="contained" onClick={() => handleModalConfirm(modalPkg)}>결제</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

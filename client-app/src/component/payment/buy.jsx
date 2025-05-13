import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Divider
} from '@mui/material';
import IamportButton from '../common/IamportButton.jsx';
import { getList } from '../../api/paymentItemApi.js';

export default function PackagePaymentScreen() {
    // 서버에서 받아올 패키지 리스트: [{ id, name, time, price }, ...]
    const [packages, setPackages] = useState([]);

    // 선택된 카드 인덱스
    const [selectedIdx, setSelectedIdx] = useState(null);

    useEffect(() => {
        // 컴포넌트 마운트 시 한 번만 호출
        getList()
            .then(response => {
                // axios 기본형: response.data 에 실제 리스트가 들어 있다고 가정
                setPackages(response.data);
            })
            .catch(error => {
                console.error('패키지 리스트 로드 실패', error);
            });
    }, []); // 빈 deps: 마운트 시 단 한 번만 실행

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
                    // orderId: 가맹점 주문번호 (중복 방지를 위해 timestamp 추가)
                    const orderId = `${id}_${Date.now()}`;

                    return (
                        <Grid key={id} item>
                            <Card
                                variant={isSelected ? 'elevation' : 'outlined'}
                                sx={{
                                    width: 280,
                                    borderColor: isSelected ? 'primary.main' : undefined
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {/* 예: time이 '1시간' 또는 숫자(시간)일 때 */}
                                        {/* 문자열이면 그대로, 숫자면 `${time}시간` */}
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
                                        <IamportButton
                                            orderId={orderId}
                                            productName={name}
                                            amount={price}
                                        />
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}

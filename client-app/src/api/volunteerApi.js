import axios from "axios";
import qs from 'qs';

export const getList = async (params) => {
    console.log(params);
    const response = await axios.get("https://apis.data.go.kr/B460014/vmsdataview/getVollcolectionList",
        {params:{
                serviceKey: params.serviceKey, // 인증키
                numOfRows: params.numOfRows, // 페이지 사이즈
                pageNo: params.pageNo, // 페이지
                strDate: params.strDate, // 조회 시작일
                endDate: params.endDate, // 조회 끝일
                areaCode: params.areaCode, // 지역
                TermType: params.TermType, // 1 정기 2 비정기
                status: params.status // 1 모집중 2 모집완료
            },
            paramsSerializer: p => qs.stringify(p, {encode: false}) // 인코딩 된 키 한번더 인코딩 하는 것을 막기 위해
        })
    console.log(response.request.responseURL);
    return response;
}
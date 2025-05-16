// src/api/donationApi.js
import axios from 'axios';
import qs from 'qs';
import api from "./Api.js";

const API_URL = '/openapi/service/rest/ContributionGroupService';

const apiServerUrl = "/api/donation/";

export const getCntrProgramList = async (params) => {
    // 예시: 올바른 파라미터 key 사용
    const response = await axios.get(
        `${API_URL}/getCntrProgramList`,
        {
            params: {
                serviceKey: params.serviceKey,
                schCntrProgrmRegistNo: params.progrmRegistNo,
                schSido:               params.schSido,
                schRcritBgnde:         params.schRcritBgnde,
                schRcritEndde:         params.schRcritEndde,
                keyword:               params.keyword,
                step:                  params.step,
                sortColumn:            params.sortColumn,
                sortType:              params.sortType,
                pageNo:                params.pageNo,
                numOfRows:             params.numOfRows
            },
            paramsSerializer: p => qs.stringify(p, { encode: false })
        }
    );
    return response;
};
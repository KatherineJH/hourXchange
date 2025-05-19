// src/api/donationApi.js
import axios from 'axios';
import qs from 'qs';
import api from "./Api.js";

const API_URL = '/openapi/service/rest/ContributionGroupService';

const apiServerUrl = "/api/donation/";

export const postDonation = async (data) => {
    const response  = await api.post(apiServerUrl, data);

    return response
}

export const putUpdateDonation = async (id, data) => {
    const response  = await api.put(apiServerUrl + "modify/" + id, data);

    return response
}

export const putDeleteDonation = async (id) => {
    const response  = await api.put(apiServerUrl + "delete/" + id);

    return response
}

export const getDonation = async (id) => {
    const response  = await api.get(apiServerUrl + id);

    return response
}

export const getList = async (page, size) => {
    const response = await api.get(apiServerUrl + "list", {
        params: { page, size },
    });
    return response;
};

// 추천 검색어 불러오기
export const getAutocompleteSuggestions = async (prefix) => {
    const response = await api.get("/api/search/autocomplete", {
        params: {
            prefix,
            index: "donation_index",
        },
    });
    return response;
};

// 📌 게시판 검색 (keyword, page, size로 검색)
export const getListWithKeyword = async (keyword, page = 0, size = 10) => {
    const response = await api.get("/api/search/donation", {
        params: { keyword, page, size },
    });
    return response;
};

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
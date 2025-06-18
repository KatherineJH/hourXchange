// src/api/donationApi.js
import axios from "axios";
import qs from "qs";
import api from "./Api.js";

const apiServerUrl = "/api/donation/";

export const postDonation = async (data) => {
  const response = await api.post(apiServerUrl, data);

  return response;
};

export const putUpdateDonation = async (id, data) => {
  const response = await api.put(apiServerUrl + "modify/" + id, data);

  return response;
};

export const putCancelDonation = async (id) => {
  const response = await api.put(apiServerUrl + "cancel/" + id);

  return response;
};

export const getDonation = async (id) => {
  const response = await api.get(apiServerUrl + id);

  return response;
};

export const getList = async (page, size) => {
  const response = await api.get(apiServerUrl + "list", {
    params: { page, size },
  });
  return response;
};

export const getMyDonation = async () => {
  const response = await api.get(apiServerUrl + "my");

  return response;
};

export const putEndDonation = async (id) => {
  const response = await api.put(apiServerUrl + "end/" + id);

  return response;
};

export const putCompleteDonation = async (id, url) => {
  const response = await api.put(apiServerUrl + "complete/" + id, url, {
    headers: {
      "Content-Type": "text/plain", // text/plain으로 명시
    },
  });

  return response;
};

export const putUpdateDonationProof = async (id, url) => {
  const response = await api.put(apiServerUrl + "updateProof/" + id, url, {
    headers: {
      "Content-Type": "text/plain", // text/plain으로 명시
    },
  });

  return response;
};

export const getSearch = async (page, size, params) => {
  const response = await api.get(apiServerUrl + "search/list", {
    params: {
      ...params,
      page,
      size,
    },
  });
  return response;
};

/**
 * 목표 대비 진행률 상위 n개 기부 리스트
 * @param {number} limit 반환할 개수 (default 5)
 */
export const getTopByProgress = async (limit = 5) => {
  return await api.get(`${apiServerUrl}top-progress`, {
    params: { limit },
  });
};

/**
 * 조회수 상위 n개 기부 리스트
 * @param {number} limit 반환할 개수 (default 5)
 */
export const getTopByViews = async (limit = 5) => {
  return await api.get(`${apiServerUrl}top-views`, {
    params: { limit },
  });
};

/**
 * 생성일 최신 순 상위 n개 기부 리스트
 * @param {number} limit 반환할 개수 (default 5)
 */
export const getRecentDonations = async (limit = 5) => {
  return await api.get(`${apiServerUrl}recent`, {
    params: { limit },
  });
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

// 게시판 검색 (keyword, page, size로 검색)
export const getListWithKeyword = async (keyword, page = 0, size = 10) => {
  const response = await api.get("/api/search/donations", {
    params: { keyword, page, size },
  });
  return response;
};

const API_URL = "/openapi/service/rest/ContributionGroupService";

export const getCntrProgramList = async (params) => {
  const response = await axios.get(`${API_URL}/getCntrProgramList`, {
    params: {
      serviceKey: params.serviceKey,
      schCntrProgrmRegistNo: params.progrmRegistNo,
      schSido: params.schSido,
      schRcritBgnde: params.schRcritBgnde,
      schRcritEndde: params.schRcritEndde,
      keyword: params.keyword,
      step: params.step,
      sortColumn: params.sortColumn,
      sortType: params.sortType,
      pageNo: params.pageNo,
      numOfRows: params.numOfRows,
      // 캐시 방지용 타임스탬프
      _: Date.now(),
    },
    paramsSerializer: (p) => qs.stringify(p, { encode: false }),
    // 캐시 무효화 헤더
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response;
};

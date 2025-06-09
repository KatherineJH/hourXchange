import api from "./Api.js";

// 1) 광고 전체 리스트 조회
export async function fetchAdvertisement() {
  const res = await api.get("/api/advertisement");
  return res.data;
}

// 2) 광고 전체(GET /api/advertisement/all)
export const getAdvertisement = async () => {
  try {
    console.log("광고 호출 완료");
    const response = await api.get("/api/advertisement/all");
    console.log("광고 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("광고 전체 불러오기 실패:", error);
    throw error;
  }
};

// 3) 광고 하나 상세 조회(GET /api/advertisement/{id})
export const getAdvertisementDetail = async (id) => {
  try {
    const response = await api.get(`/api/advertisement/${id}`);
    // 일부 API가 `response.data.data` 형태로 내려줄 수도 있어서 둘 중 하나를 사용
    const ad = response.data.data ?? response.data;
    console.log("▶️ 상세 조회 결과:", ad);
    return ad;
  } catch (error) {
    console.error("광고 상세 조회 실패:", error);
    throw error;
  }
};

// 4) 광고 등록(POST /api/advertisement)
export const postAdvertisement = async (adData) => {
  try {
    console.log("postAdvertisement 호출 데이터:", adData);
    // 주의: URL 끝에 슬래시(/)가 붙어 있으면 맵핑이 다를 수 있으므로
    //       백엔드와 정확히 일치하도록 "/api/advertisement"로 보냅니다.
    const response = await api.post("/api/advertisement", adData);
    console.log("광고 등록 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("광고 등록 실패:", error);
    throw error;
  }
};

// 5) 내 광고 목록 조회(GET /api/advertisement/my)
export const getMyAdvertisements = async () => {
  try {
    console.log("내 광고 호출 완료");
    const response = await api.get("/api/advertisement/my");
    console.log("내 광고 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("내 광고 불러오기 실패:", error);
    throw error;
  }
};

// 6) 광고 삭제(DELETE /api/advertisement/{id})
export const deleteAdvertisement = async (id) => {
  try {
    const response = await api.delete(`/api/advertisement/${id}`);
    console.log("광고 삭제 완료:", id);
    return response.data;
  } catch (error) {
    console.error("광고 삭제 실패:", error);
    throw error;
  }
};

// 7) 광고 수정(PUT /api/advertisement/{id})
export const updateAdvertisement = async (id, adData) => {
  try {
    const response = await api.put(`/api/advertisement/${id}`, adData);
    console.log("광고 수정 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("광고 수정 실패:", error);
    throw error;
  }
};

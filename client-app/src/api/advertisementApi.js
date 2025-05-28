import api from "./Api.js";

export async function fetchAdvertisement() {
  const res = await api.get("/api/advertisement");
  return res.data;
}

// 광고 전체 가져오기
export const getAdvertisement = async () => {
  try {
    console.log("광고 호출 완료");
    const response = await api.get("/api/advertisement/all");
    console.log("광고 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("광고 전체 불러오기 실패:", error);
    throw error; // 필요 시 상위에서 처리
  }
};

// 광고 하나 상세 조회
export const getAdvertisementDetail = async (id) => {
  try {
    const response = await api.get(`/api/advertisement/${id}`);

    const ad = response.data.data ?? response.data;
    console.log("▶️ 상세 조회 결과:", ad);
    return ad;
  } catch (error) {
    console.error("광고 상세 조회 실패:", error);
    throw error;
  }
};

//광고 등록
export const postAdvertisement = async (adData) => {
  try {
    console.log("postAdvertisement 호출 데이터:", adData);
    const response = await api.post("/api/advertisement/", adData);
    console.log("광고 등록 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("광고 등록 실패:", error);
    throw error;
  }
};

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

// 광고 삭제
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

//광고 수정
export const updateAdvertisement = async (id, adData) => {
  try {
    // PUT /api/advertisement/{id} 로 adData(객체)를 보냅니다.
    const response = await api.put(`/api/advertisement/${id}`, adData);
    return response.data; // 보통 { data: AdvertisementResponse } 형태라면 .data 로 꺼내 쓰세요
  } catch (error) {
    console.error("광고 수정 실패:", error);
    throw error;
  }
};

// import api from "./Api.js";

// export const getAdvertisement = async (advertisementData) => {
//   cosole.log("getAdvertisement 호출완료", advertisementData);
//   const response = await api.get("/api/advertisement/all", advertisementData);
//   console.log("광고 응답 데이터:", response.data);
//   return response.data;
// };

// export const getAdvertisementDetail = (id) => {
//   console.log("getAdvertisementId 호출완료", { id });
//   const response = await api.get(`/api/advertisement/${id}`);
//   console.log("광고 상세 조회",response.data);
//   return response.data;
// };
import api from "./Api.js";

export async function fetchAdvertisement() {
  const res = await api.get("/api/advertisement");
  return res.data;
}

// 광고 전체 가져오기
export const getAdvertisement = async () => {
  try {
    console.log("🟢 getAdvertisement 호출 완료");
    const response = await api.get("/api/advertisement/all");
    console.log("✅ 광고 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 광고 전체 불러오기 실패:", error);
    throw error; // 필요 시 상위에서 처리
  }
};

// 광고 하나 상세 조회
export const getAdvertisementDetail = async (id) => {
  try {
    console.log("getAdvertisementDetail 호출완료", id);
    const response = await api.get(`/api/advertisement/${id}`);
    console.log("광고 상세 조회 응답:", response.data);
    return response.data.data; // ✅ 광고 데이터만 추출해서 반환
  } catch (error) {
    console.error("❌ 광고 상세 조회 실패:", error);
    throw error;
  }
};

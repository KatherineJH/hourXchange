import api from "./Api.js";

const apiServerUrl = "/api/auth/";

export const postSave = async (data) => {
  const response = await api.post(apiServerUrl + "signup", data, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

// 이메일 로그인 액션
export const loginUser = async (formData) => {
  try {
    console.log(formData.get("email"));
    console.log(formData.get("password"));
    const response = await api.post("/api/auth/login", formData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || "로그인 실패";
  }
}

// 로그아웃 액션
export const logoutUser = async () => {
  try {
    const response = await api.post("/api/auth/logout", {});
    return response.data;
  } catch (error) {
    return error.response?.data || "로그아웃 실패";
  }
}

// 사용자 정보 조회 액션
export const fetchUser = async () => {
  // try {
    const response = await api.get("/api/auth/me");
    return response.data;
  // } catch (error) {
  //   throw error.response?.data
  //   // return typeof error.response?.data === "string"
  //   //     ? error.response.data : error.response?.data?.message || "사용자 정보 조회 실패";
  // }
}

// 사용자 정보 업데이트
export const updateUser = async (userData) => {
  const response = await api.put("/api/user/update", userData);
  return response.data;
};
// 사용자 비밀번호 변경
export const updatePassword = async ({ newPassword, confirmPassword }) => {
  const response = await api.put("/api/auth/password", {
    newPassword,
    confirmPassword,
  });
  return response.data;
};
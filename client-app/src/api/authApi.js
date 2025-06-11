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
    const response = await api.post("/api/auth/login", formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// 로그아웃 액션
export const logoutUser = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    return error.response?.data || "로그아웃 실패";
  }
}

// 사용자 정보 조회 액션
export const fetchUser = async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
}

// 사용자 정보 업데이트
export const updateUser = async (id, userData) => {
  console.log(id);
  console.log(userData);
  const response = await api.put("/api/user/update/" + id, userData);
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
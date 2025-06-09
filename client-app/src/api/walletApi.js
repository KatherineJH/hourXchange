import api from "./Api.js";

const walletApiUrl = "/api/wallet";

export const getWalletHistory = async () => {
  const response = await api.get(walletApiUrl + "/history");
  return response.data;
};

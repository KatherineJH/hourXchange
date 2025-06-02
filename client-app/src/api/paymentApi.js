import api from "./Api.js";

const apiServerUrl = "/api/pay/";

export const postTransaction = async (data) => {
    console.log(data);
    const response = await api.post(apiServerUrl + 'iamport/transaction', data)

    return response;
};

export const postOrder = async (data) => {
    console.log(data);
    const response = await api.post(apiServerUrl + 'order', data)
    return response;
}

export const postVerify = async (data) => {
    console.log(data);
    const response = await api.post(apiServerUrl + 'verify', data)
    return response;
}

export const getOrderList = async (page, size) => {
    const response = await api.get(apiServerUrl + 'order/list', {
        params: {
            page,
            size,
        }
    })
    return response;
}

export const getOrderSearch = async (page, size, params) => {
    const response = await api.get(apiServerUrl + "order/search/list", {
        params: {
            ...params,
            page,
            size
        }
    });
    return response;
};

export const getPaymentList = async (page, size) => {
    const response = await api.get(apiServerUrl + 'payment/list', {
        params: {
            page,
            size,
        }
    })
    return response;
}

export const getPaymentSearch = async (page, size, params) => {
    const response = await api.get(apiServerUrl + "payment/search/list", {
        params: {
            ...params,
            page,
            size
        }
    });
    return response;
};
import type { AxiosError } from "axios";
import apiClient from "../../api/http";
import { ApiError } from "../../utils/errors";

export const walletApi = {
    getWallet: async  () => {
        try {
            const response = await apiClient.get('/wallets/me');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            throw new ApiError(err.message, err.response?.status ?? 500);
        }
    }
};
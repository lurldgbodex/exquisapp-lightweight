import type { AxiosError } from "axios";
import apiClient from "../../api/http";
import { ApiError } from "../../utils/errors";

export const paymentApi = {
    deposit: async (amount: number) => {
        try {
            const response = await apiClient.post('payments/transact', { amount });
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            throw new ApiError(err.message, err.response?.status ?? 500);
        }
    },
    transfer: async (data: { paid_to: string, amount: number }) => {
        try {
            const response = await apiClient.post('payments/transact', data);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            throw new ApiError(err.message, err.response?.status ?? 500);
        }
    },
    transactions: async () => {
        try {
            const response = await  apiClient.get('billings/me/transactions');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            throw new ApiError(err.message, err.response?.status ?? 500);
        }
    }
}
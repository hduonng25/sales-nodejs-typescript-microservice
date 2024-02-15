import axios, { AxiosResponse } from 'axios';
import { configs } from '~/config';
import { HttpError, HttpsStatus, error } from 'app';
import { ProductDetails } from '~/interface/request';

const api = axios.create({
    baseURL: configs.services.product.api(),
});

export async function getQuantity(params: {
    id: string;
}): Promise<ProductDetails> {
    const url = `/get-quantity`;
    const errors = error.services(url);

    try {
        const details = await api.post(url, params);
        if (details.status !== HttpsStatus.OK) {
            throw new HttpError(errors);
        }
        return details.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status) {
            if (e.response.status !== HttpsStatus.OK) {
                throw new HttpError(errors);
            }
        } else {
            throw new HttpError(errors);
        }

        throw new Error('An unexpected error occurred.');
    }
}

export async function updateQuantityProduct(params: {
    id: string;
    quantity: number;
}) {
    const url = `/update-quantity`;
    const errors = error.services(url);

    try {
        const result = await api.put(url, params);
        if (result.status !== HttpsStatus.OK) {
            throw new HttpError(errors);
        }
        return result.data;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status) {
            if (e.response.status !== HttpsStatus.OK) {
                throw new HttpError(errors);
            }
        } else {
            throw new HttpError(errors);
        }

        throw new Error('An unexpected error occurred.');
    }
}

export async function getCheckProduct(params: {
    id: string;
}): Promise<{
    body?: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
        color: string;
        size: string;
    };
    status?: HttpsStatus;
    path: string;
}> {
    const url = `/product`;
    try {
        const res = await api.post<{
            id: string;
            name: string;
            price: number;
            quantity: number;
            image: string;
            color: string;
            size: string;
        }>(`${url}`, params);
        return {
            body: res.data,
            status: res.status,
            path: url,
        };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status) {
            return { status: e.response?.status, path: url };
        } else {
            throw new HttpError(error.services(url));
        }
    }
}

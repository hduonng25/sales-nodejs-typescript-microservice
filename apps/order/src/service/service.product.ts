import axios, { AxiosResponse } from 'axios';
import { configs } from '~/config';
import { HttpError, HttpsStatus, Result, error } from 'app';
import { AddProductBody, ProductDetails } from '~/interface/request';

const api = axios.create({
    baseURL: configs.services.product.api(),
});

export async function getProductDetails(
    params: AddProductBody,
): Promise<ProductDetails | undefined> {
    const url = `/get-by-color-size`;
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
    }
}

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

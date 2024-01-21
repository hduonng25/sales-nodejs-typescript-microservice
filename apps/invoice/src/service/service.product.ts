import axios, { AxiosResponse } from 'axios';
import { configs } from '~/config';
import { HttpError, HttpsStatus, Result, error } from 'app';
import { AddProductBody, ProductDetails } from '~/interface/request';

export async function getProductDetails(
    params: AddProductBody,
): Promise<ProductDetails | undefined> {
    const url = `${configs.services.product.api()}/get-by-color-size`;
    const errors = error.services(url);

    try {
        const details = await axios.post(url, params);
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

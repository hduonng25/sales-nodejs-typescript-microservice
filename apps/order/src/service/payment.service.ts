import { HttpError, HttpsStatus, error } from 'app';
import axios from 'axios';
import { configs } from '../config';
import { IGetOrderRes, IPaymentRes } from '../interface/respone';

const api = axios.create({
    baseURL: configs.services.payment.api(),
});

export async function getCreateOrder(params: {
    amount: number;
}): Promise<{
    body?: IPaymentRes;
    status?: HttpsStatus;
    path: string;
}> {
    const url = `/payment`;
    try {
        const res = await api.post<IPaymentRes>(`${url}`, params);
        return { body: res.data, status: res.status, path: url };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status) {
            return { status: e.response?.status, path: url };
        } else {
            throw new HttpError(error.services(url));
        }
    }
}

export async function getOrder(params: {
    orderCode: string;
}): Promise<{
    body?: IGetOrderRes;
    status?: HttpsStatus;
    path: string;
}> {
    const url = `/payment`;
    try {
        const res = await api.get<IGetOrderRes>(
            `${url}/${params.orderCode}`,
        );
        return { body: res.data, path: url, status: res.status };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status) {
            return { status: e.response?.status, path: url };
        } else {
            throw new HttpError(error.services(url));
        }
    }
}

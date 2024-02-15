import { HttpError, HttpsStatus, error } from 'app';
import axios, { AxiosResponse } from 'axios';
import { configs } from '~/config';

const api = axios.create({
    baseURL: configs.services.user.api(),
});

export async function getCheckUser(params: { id: string }): Promise<{
    body?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        adress: string;
    };
    status?: HttpsStatus;
    path: string;
}> {
    const url = `/user`;
    try {
        const res = await api.post<{
            id: string;
            name: string;
            email: string;
            phone: string;
            adress: string;
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

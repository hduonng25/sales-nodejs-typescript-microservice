import { config } from '~/config/config';
import axios from 'axios';
import { HttpError, HttpsStatus, error } from 'app';

export async function sendMailcreateUser(
    to: String,
    user: String,
): Promise<void> {
    const url = `${config.services.mails.api()}`;
    const errors = error.services(url);
    try {
        const email = await axios.post(`${url}/`, {
            to,
            user,
        });
        if (email.status !== HttpsStatus.OK) {
            throw new HttpError(errors);
        }
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

import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { IUser } from '~/interface/model';
import { Users } from '~/model';

export async function checkExitsAccount(params: {
    id?: string;
    email?: string;
    phone?: string;
}): Promise<void> {
    const check = async (field: string, value: string) => {
        const filter: FilterQuery<IUser> = {
            [field]: {
                $regex: `^${value}$`,
                $options: 'i',
            },
            is_deleted: false,
        };

        const user = await Users.findOne(filter);
        if (user && user.id !== params.id) {
            throw new HttpError({
                status: HttpsStatus.BAD_REQUEST,
                code: 'INVALID_DATA',
                description: {
                    en: `${field} already exists`,
                    vi: `${field} da ton tai`,
                },
                errors: [
                    {
                        location: `${field}`,
                        param: 'body',
                        value: `${field}`,
                    },
                ],
            });
        }
    };

    if (params.email) {
        await check('email', params.email);
    }

    if (params.phone) {
        await check('phone', params.phone);
    }
}

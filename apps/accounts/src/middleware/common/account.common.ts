import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { IUser } from '~/interface/model';
import { Users } from '~/model';

export async function checkExitsAccount(params: { id?: string; email?: string }): Promise<void> {
    const match: FilterQuery<IUser> = {
        email: {
            $regex: `^${params.email}$`,
            $options: 'i',
        },
        is_deleted: false,
    };

    const user = await Users.findOne(match);
    if (user) {
        if (user.id === params.id) return;
        throw new HttpError({
            status: HttpsStatus.BAD_REQUEST,
            code: 'INVALID_DATA',
            description: {
                en: 'Email user already exists',
                vi: 'Email nguoi dung da ton tai',
            },
            errors: [
                {
                    location: 'Email',
                    param: 'body',
                    value: params.email,
                },
            ],
        });
    }
}

import { HttpsStatus, Result, success } from 'app';
import { FilterQuery } from 'mongoose';
import { Users } from '../model';

export async function checkUser(params: {
    id: string;
}): Promise<Result> {
    const user = await Users.findOne(
        { id: params.id, is_deleted: false },
        { _id: 0, id: 1, name: 1, email: 1, phone: 1, adress: 1 },
    );

    if (!user) {
        return {
            code: 'NOT_FOUND',
            status: HttpsStatus.NOT_FOUND,
            errors: [
                {
                    location: 'body',
                    param: 'id',
                },
            ],
        };
    } else {
        return success.ok(user);
    }
}

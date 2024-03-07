import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { ISize } from '../../interface/models';
import { Sizes } from '../../models';

export async function CheckExitsSize(params: {
    name?: string;
    id?: string;
}): Promise<void> {
    const match: FilterQuery<ISize> = {
        name: {
            $regex: `^${params.name}$`,
            $options: 'i',
        },
        is_deleted: false,
    };

    const size = await Sizes.findOne(match);
    if (size && size.id !== params.id) {
        throw new HttpError({
            status: HttpsStatus.BAD_REQUEST,
            code: 'INVALID_DATA',
            description: {
                en: 'name already exitsts',
                vi: 'Ten kich co da ton tai',
            },
            errors: [
                {
                    location: 'Name',
                    param: 'body',
                    value: `${params.name}`,
                },
            ],
        });
    }
}

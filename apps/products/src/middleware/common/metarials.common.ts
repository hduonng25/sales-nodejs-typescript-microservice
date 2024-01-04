import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { IMetarial } from '~/interface/models';
import { Metarials } from '~/models';

export async function checkExitsMaterial(params: {
    id?: string;
    name?: string;
}): Promise<void> {
    const match: FilterQuery<IMetarial> = {
        name: {
            $regex: `^${params.name}$`,
            $options: 'i',
        },
        is_deleted: false,
    };

    const material = await Metarials.findOne(match);
    if (material && material.id !== params.id) {
        throw new HttpError({
            status: HttpsStatus.BAD_REQUEST,
            code: 'INVALID_DATA',
            description: {
                en: 'Name already exits',
                vi: 'Ten da ton tai',
            },
            errors: [
                {
                    location: 'Name',
                    param: 'body',
                    value: params.name,
                },
            ],
        });
    }
}

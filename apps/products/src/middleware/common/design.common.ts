import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { IDesign } from '../../interface/models';
import { Designs } from '../../models';

export async function checkExitsDesign(params: {
    id?: string;
    name?: string;
}): Promise<void> {
    const match: FilterQuery<IDesign> = {
        name: {
            $regex: `^${params.name}$`,
            $options: 'i',
        },
    };

    const design = await Designs.findOne(match);
    if (design && design.id !== params.id) {
        throw new HttpError({
            status: HttpsStatus.BAD_REQUEST,
            code: 'INVALID_DATA',
            description: {
                en: 'Name is already exits',
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

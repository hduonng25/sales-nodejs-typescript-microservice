import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { IProduct } from '~/interface/models';
import { Products } from '~/models';

export async function checkExitsProduct(params: {
    id?: string;
    name?: string;
}): Promise<void> {
    const match: FilterQuery<IProduct> = {
        name: {
            $regex: `^${params.name}$`,
            $options: 'i',
        },
        is_deleted: false,
    };

    const product = await Products.findOne(match);

    if (product && product.id !== params.id) {
        throw new HttpError({
            status: HttpsStatus.BAD_REQUEST,
            code: 'INVALID_DATA',
            description: {
                en: 'product is readly exits',
                vi: 'Ten san pham da ton tai',
            },
            errors: [
                {
                    location: 'name',
                    param: 'body',
                    value: params.name,
                },
            ],
        });
    }
}

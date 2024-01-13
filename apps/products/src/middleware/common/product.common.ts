import { HttpError, HttpsStatus } from 'app';
import { FilterQuery } from 'mongoose';
import { IProduct, IProductDetail } from '~/interface/models';
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

export async function checkExitProductDetails(params: {
    id_product?: string;
    id_productDetails?: string;
    id_color?: string;
    id_size?: string;
}): Promise<void> {
    const product = await Products.findOne({
        id: params.id_product,
        is_deleted: false,
    });

    const product_details = product?.product_details?.find(
        (d) =>
            d.color.id === params.id_color &&
            d.size.id === params.id_size,
    );

    if (product_details) {
        let data = {
            color: params.id_color,
            size: params.id_size,
        };

        throw new HttpError({
            status: HttpsStatus.BAD_REQUEST,
            code: 'INVALID_DATA',
            description: {
                en: 'product details is readly exits',
                vi: 'San pham co mau sac va kich co nay da ton tai',
            },

            errors: [
                {
                    location: 'product details',
                    param: 'body',
                    value: data,
                },
            ],
        });
    }
}

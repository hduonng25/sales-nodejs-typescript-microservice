import { Result, success } from 'app';
import { v1 } from 'uuid';
import { IProduct, IProductDetail } from '~/interface/models';
import {
    createProductBody,
    createProductDetails,
} from '~/interface/request';
import { checkExitsProduct } from '~/middleware/common';
import {
    Colors,
    Designs,
    Metarials,
    Products,
    Sizes,
} from '~/models';

export async function createProductDetail(
    params: createProductDetails,
): Promise<IProductDetail> {
    const color = await Colors.findOne({ id: params.id_color });
    const size = await Sizes.findOne({ id: params.id_size });
    const metarial = await Metarials.findOne({
        id: params.id_material,
    });
    const design = await Designs.findOne({ id: params.id_designs });

    const details: IProductDetail = {
        id: v1(),
        quantity: params.quantity,
        size: {
            id: size?.id,
            name: size?.name,
        },

        color: {
            id: color?.id,
            name: color?.name,
            code: color?.code,
        },

        metarial: {
            id: metarial?.id,
            name: metarial?.name,
        },

        designs: {
            id: design?.id,
            name: design?.name,
        },

        images: params.images.map((name: string) => ({
            id: v1(),
            name: name,
            status: false,
        })),
    };

    return details;
}

export async function createProduct(
    params: createProductBody,
): Promise<Result> {
    await checkExitsProduct({
        name: params.name,
    });

    const details = [];

    for (const colorId of params.color) {
        for (const sizeId of params.size) {
            const detail = await createProductDetail({
                id_color: colorId,
                id_size: sizeId,
                quantity: params.quantity,
                id_material: params.metarial,
                id_designs: params.designs,
                images: params.image,
            });

            details.push(detail);
        }
    }

    const new_product: IProduct = {
        id: v1(),
        name: params.name,
        price: params.price,
        note: params.note,
        product_details: details,
    };

    const product = new Products(new_product);
    await product.save();
    return success.ok(product);
}

export async function getProduct(): Promise<Result> {
    const result = await Products.find();
    return success.ok(result);
}

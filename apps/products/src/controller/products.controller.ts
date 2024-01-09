import { Result, success } from 'app';
import { v1 } from 'uuid';
import { IProduct, IProductDetail } from '~/interface/models';
import {
    createProductBody,
    createProductDetails,
    setImageProductDetailsBody,
    updateProductsBody,
    updateProductsDetails,
} from '~/interface/request';
import { checkExitsProduct } from '~/middleware/common';
import {
    Colors,
    Designs,
    Metarials,
    Products,
    Sizes,
} from '~/models';

//TODO: create product details
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
    };

    return details;
}

//TODO: create product and product details
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

//TODO: get list product
export async function getProduct(): Promise<Result> {
    const result = await Products.find();
    return success.ok(result);
}

//TODO: get product by id
export async function getProductByID(params: {
    id: string;
}): Promise<Result> {
    const product = await Products.findOne({ id: params.id });
    return success.ok(product);
}

export async function updateProducts(
    params: updateProductsBody,
): Promise<Result> {
    await checkExitsProduct({
        id: params.id,
        name: params.name,
    });

    const update_product: IProduct = {
        name: params.name,
        price: params.price,
    };

    const product = await Products.findOneAndUpdate(
        { id: params.id },
        { $set: update_product },
        { new: true },
    );

    return success.ok(product);
}

//TODO: update quantity product details
export async function updateQuantityProductsDetails(
    params: updateProductsDetails,
): Promise<Result> {
    await Products.updateOne(
        {
            id: params.id_product,
            'product_details.id': params.id_product_details,
        },
        { $set: { 'product_details.$.quantity': params.quantity } },
    );

    const product = await Products.findOne({
        id: params.id_product,
    });

    return success.ok(product);
}

//TODO: set image to product details
export async function setImageProductDetails(
    params: setImageProductDetailsBody,
): Promise<Result> {
    const images = params.image.map((name: string) => ({
        id: v1(),
        name: name,
        status: false,
    }));

    await Products.updateOne(
        {
            id: params.id_product,
            'product_details.id': params.id_product_details,
        },
        { $set: { 'product_details.$.image': images } },
    );

    const product = await Products.findOne({
        id: params.id_product,
    });

    return success.ok(product);
}

//TODO: set avatar product details
export async function setAvatarProductDetails(
    params: setImageProductDetailsBody,
): Promise<Result> {
    const product = await Products.findOne({
        id: params.id_product,
    });

    const product_details = product?.product_details?.find(
        (d) => d.id === params.id_product_details,
    ) as IProductDetail;

    let avatar = [];

    for (let image of product_details?.image ?? []) {
        if (image.id === params.id_image) {
            image.status = true;
        } else {
            image.status = false;
        }
        avatar.push(image);
    }

    product_details.image = avatar;
    await product?.save();
    return success.ok(product_details);
}

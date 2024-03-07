import { HttpError, Result, error, success } from 'app';
import { FilterQuery, PipelineStage } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { v1 } from 'uuid';
import {
    FindReqQuery,
    activeProductBody,
    activeProductDetails,
    createProductBody,
    createProductDetails,
    newProductDetails,
    setImageProductDetailsBody,
    updateProductsBody,
    updateProductsDetails,
} from '../interface/request';
import { IProduct, IProductDetail } from '../interface/models';
import {
    Colors,
    Designs,
    Metarials,
    Products,
    Sizes,
} from '../models';
import {
    checkExitProductDetails,
    checkExitsProduct,
} from '../middleware/common';

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

        is_active: true,
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
export async function findProducts(
    params: FindReqQuery,
): Promise<Result> {
    //khoi tao bien filter va sort de su dung trong truy van
    let filter: FilterQuery<IProduct> = {};
    let sort: Record<string, 1 | -1> = { created_date: -1 };

    try {
        //Neu co tham so truy van (query), chuyen doi no thanh dieu kien sap xep MongoDB
        //Sau do gan no vao bien sort
        if (params.query) {
            const uFilter = parseQuery(params.query);
            filter = { $and: [filter, uFilter] };
        }
        params.sort && (sort = parseSort(params.sort));
    } catch (e) {
        //Neu co loi trong qua trinh chuyen doi quer hoac sort, xu ly loi va tra ra HttpError
        const err = e as unknown as ParseSyntaxError;
        const errorValue =
            err.message === params.sort ? params.sort : params.query;
        throw new HttpError(
            error.invalidData({
                location: 'query',
                param: err.type,
                message: err.message,
                value: errorValue,
            }),
        );
    }

    //Dinh nghia cac truong can tra ve trong ket qua
    const project = {
        _id: 0,
        id: 1,
        price: 1,
        name: 1,
        is_active: 1,
        created_date: 1,
    };

    //Kiem tra va dieu chinh du lieu cua params.page de dam bao du lieu khong am
    params.page = params.page <= 0 ? 1 : params.page;

    //Khoi tao facetData de su dung trong truy van MongoDB
    const facetData =
        params.size == -1
            ? []
            : [
                  { $skip: (params.page - 1) * params.size },
                  { $limit: params.size * 1 },
              ];

    const facet = {
        meta: [{ $count: 'total' }],
        data: facetData,
    };

    Object.assign(filter, { is_deleted: false });

    //Dinh nghia cac giai doan cua pipeline truy van MongoDB
    const pipelane: PipelineStage[] = [
        { $match: filter }, //Giai doan 1: Tim kiem theo dieu kien cua filter
        { $project: project }, //Giai doan 2: Chon loc cac truong can tra ve
        { $sort: sort }, //Giai doan 3: Sap xep du lieu
        { $facet: facet }, //Giai doan 4: Facet thuc hien phan trang
    ];

    //Thuc hien truy van bang aggregate va su ly ket qua
    const products = await Products.aggregate(pipelane)
        .collation({ locale: 'vi' }) //Lay du lieu theo tieng Viet
        .then((res) => res[0]) //Lay du lieu tu giai doan dau tien
        .then(async (res) => {
            //Xu ly ket qua va them thong tin san pham vao moi muc trong du lieu
            const total = !(res.meta.length > 0)
                ? 0
                : res.meta[0].total;

            let totaPage = Math.ceil(total / params.size);
            totaPage = totaPage > 0 ? totaPage : 1;

            //Tra ve ket qua cuoi cung
            return {
                page: Number(params.page),
                total: total,
                total_page: totaPage,
                data: res.data,
            };
        });

    return success.ok(products);
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

export async function activeProduct(
    params: activeProductBody,
): Promise<Result> {
    const product = await Products.findOneAndUpdate(
        { id: params.id, is_deleted: false },
        { $set: { is_active: params.is_active } },
        { new: true },
    );

    return success.ok({
        mess: !params.is_active
            ? `inactive product ${product?.name} successfuly`
            : `active product ${product?.name} successfuly`,
        data: product,
    });
}

export async function deleteProduct(params: {
    id: string;
}): Promise<Result> {
    const product = await Products.findOneAndUpdate(
        { id: params.id },
        { $set: { is_deleted: true } },
        { new: true },
    );

    return success.ok({
        mess: `delete product ${product?.name} successfuly`,
        data: product,
    });
}

export async function deleteManyProduct(params: {
    id: string[];
}): Promise<Result> {
    await Promise.all(
        params.id.map(async (id: string) => {
            await Products.findOneAndUpdate(
                { id: id },
                { $set: { is_deleted: true } },
            );
        }),
    );

    return success.ok({ mess: 'delete many product successfuly' });
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
        (d: any) => d.id === params.id_product_details,
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

export async function createNewProductDetails(
    params: newProductDetails,
): Promise<Result> {
    await checkExitProductDetails({
        id_color: params.id_color,
        id_size: params.id_size,
        id_product: params.id_product,
        id_productDetails: params.id_product_details,
    });

    const size = await Sizes.findOne({ id: params.id_size });
    const color = await Colors.findOne({ id: params.id_color });

    if (!size || !color) {
        return error.notFound({
            location: !size ? 'size' : 'color',
            param: 'body',
            message: !size
                ? 'size is not found'
                : 'color is not found',
        });
    }

    const product_details = await Products.aggregate([
        { $unwind: '$product_details' },
        { $match: { id: params.id_product } },
        {
            $project: {
                _id: 0,
                product_details: 1,
            },
        },
        { $limit: 1 },
    ]);

    const [
        {
            product_details: { metarial, designs, quantity },
        },
    ] = product_details;

    const detail = await createProductDetail({
        id_color: params.id_color,
        id_size: params.id_size,
        quantity: quantity,
        id_material: metarial.id,
        id_designs: designs.id,
    });

    await Products.updateOne(
        { id: params.id_product },
        {
            $push: {
                product_details: detail,
            },
        },
    );

    return success.ok({ mess: 'create successfuly' });
}

export async function inactiveAndActiveDetails(
    params: activeProductDetails,
): Promise<Result> {
    const product = await Products.findOne({
        id: params.id_product,
        is_deleted: false,
    });

    const product_detail = product?.product_details?.find(
        (d: IProductDetail) => d.id === params.id_product_details,
    ) as IProductDetail;

    product_detail.is_active = params.is_active;
    await product?.save();

    return success.ok({
        mes: !params.is_active
            ? 'inactive product details successfuly'
            : 'active product details successfuly',
    });
}

//TODO: Sales
export async function getDetails(params: {
    id: string;
}): Promise<Result> {
    const filter: FilterQuery<IProduct> = {
        id: params.id,
        is_deleted: false,
        is_active: true,
    };

    const pipeline: PipelineStage[] = [{ $match: filter }];

    const product = await Products.aggregate(pipeline)
        .collation({ locale: 'vi' })
        .then(([result]) => {
            //([result]) Ky thuat destructuring assignment trong js va ts de lay ra phan tu dau tien cua mang
            const { name, note, image, price, product_details } =
                result;

            const uniqueColors = Array.from(
                new Set(
                    product_details.map(
                        (item: IProductDetail) =>
                            item.color.code as string,
                    ),
                ),
            );
            const uniqueSizes = Array.from(
                new Set(
                    product_details.map(
                        (item: IProductDetail) =>
                            item.size.name as string,
                    ),
                ),
            );

            return {
                name,
                note,
                image,
                price,
                color: uniqueColors,
                size: uniqueSizes,
            };
        });

    return success.ok(product);
}

export async function getDetailsByColorAndSize(params: {
    id: string;
    color: string;
    size: string;
}): Promise<Result> {
    let filter: FilterQuery<IProduct> = {
        id: params.id,
        product_details: {
            $elemMatch: {
                'color.name': params.color,
                'size.name': params.size,
            },
        },
        is_active: true,
        is_deleted: false,
    };

    const product = await Products.aggregate([{ $match: filter }])
        .collation({ locale: 'vi' })
        .then(async ([result]) => {
            const details = result.product_details.find(
                (item: IProductDetail) =>
                    item.color.name === params.color &&
                    item.size.name === params.size,
            );

            let image = details.image.filter(
                (img: any) => img.status == true,
            );

            return {
                id: details.id,
                name: result.name,
                price: result.price,
                quantity: details.quantity,
                image: image[0].name,
                color: details.color.name,
                size: details.size.name,
            };
        });
    return success.ok(product);
}

export async function getQuantityProduct(params: {
    id: string;
}): Promise<Result> {
    try {
        const filter: FilterQuery<IProduct> = {
            'product_details.id': params.id,
            is_deleted: false,
        };

        const project = {
            product_details: 1,
        };

        const pipelane: PipelineStage[] = [
            { $match: filter },
            { $project: project },
        ];

        const product = await Products.aggregate(pipelane)
            .collation({ locale: 'vi' })
            .then(([result]) => {
                const details = result.product_details?.find(
                    (d: IProductDetail) => d.id === params.id,
                );

                return {
                    id: details.id,
                    quantity: details.quantity,
                };
            });
        return success.ok(product);
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

export async function updateQuantity(params: {
    id: string;
    quantity: number;
}) {
    try {
        const product = await Products.findOne({
            'product_details.id': params.id,
            'product_details.status': true,
        });

        if (product && product.product_details) {
            let detail = product.product_details?.find(
                (item: IProductDetail) => item.id === params.id,
            );

            if (detail) {
                const quantity = detail?.quantity as number;
                const quantityChange = (quantity -
                    params.quantity) as number;

                if (quantityChange < 0) {
                    return error.baseError({
                        message: 'quantity is less than 0',
                    });
                } else if (quantityChange == 0) {
                    detail.status = false;
                }

                detail.quantity = quantityChange;
                await product.save();
                return success.ok(product);
            }
        }
    } catch (e) {
        return error.notFound({});
    }
}

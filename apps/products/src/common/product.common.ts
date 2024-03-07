import { HttpsStatus, Result, success } from 'app';
import { FilterQuery, PipelineStage } from 'mongoose';
import { IProduct, IProductDetail } from '../interface/models';
import { Products } from '../models';

export async function checkProduct(params: {
    id: string;
}): Promise<Result> {
    const filter: FilterQuery<IProduct> = {
        'product_details.id': params.id,
        is_deleted: false,
        is_active: true,
    };

    const pipeline: PipelineStage[] = [{ $match: filter }];

    const product = await Products.aggregate(pipeline)
        .collation({ locale: 'vi' })
        .then(([result]) => {
            const details = result.product_details.find(
                (item: IProductDetail) => item.id === params.id,
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

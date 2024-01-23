import { Result, error, success } from 'app';
import { v1 } from 'uuid';
import { BillDetails, IInvoice } from '~/interface/model';
import {
    AddProductBody,
    ProductDetails,
    UpdateQuantityBody,
} from '~/interface/request';
import { Invoices } from '~/models';
import { getQuantity } from '~/service';

async function createBillDetails(
    params: AddProductBody,
): Promise<BillDetails> {
    const details = {
        id: v1(),
        quantity: params.quantity,
        price: params.price,
        money: params.price * params.quantity,
        product: {
            id: params.id,
            name: params.name,
            color: params.color,
            size: params.size,
            image: params.image,
        },
    };

    return details;
}

//TODO: Offline
export async function createInvoiceOffline(params: {
    name_user: string;
    type: string;
}): Promise<Result> {
    const new_invoice: IInvoice = {
        id: v1(),
        type: params.type,
        created_by: params.name_user,
    };

    const invoice = new Invoices(new_invoice);
    await invoice.save();
    return success.created(invoice);
}

export async function addProduct(
    params: AddProductBody,
): Promise<Result> {
    try {
        const invoice = await Invoices.findOne({
            code: params.code,
            is_deleted: false,
        });

        if (!invoice)
            return error.invalidData({
                location: 'body',
                param: 'bill',
                message: 'bill invalidted',
            });

        const newProduct = createBillDetails(params);
        let checkExitsProduct = invoice.details?.find(
            (d) => d.product.id === params.id,
        );

        if (checkExitsProduct) {
            checkExitsProduct.quantity += params.quantity;
            checkExitsProduct.money +=
                params.price * params.quantity;
        } else {
            invoice.details?.push(await newProduct);
        }

        await invoice.save();
        return success.ok(invoice);
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

export async function changeQuantity(params: UpdateQuantityBody) {
    try {
        const invoice = await Invoices.findOne({
            code: params.code,
            is_deleted: false,
        });

        if (!invoice) {
            return error.invalidData({
                location: 'body',
                param: 'bill',
                message: 'bill invalidated',
            });
        }

        const details = invoice.details?.find(
            (i) => i.id === params.id_details,
        );

        if (!details) {
            return error.invalidData({
                location: 'body',
                param: 'product',
                message: 'product invalidated',
            });
        }

        const product: ProductDetails = await getQuantity({
            id: details.product.id,
        });

        if (params.quantity_update > product.quantity) {
            return error.baseError({
                location: 'body',
                message: 'quantity is too large',
            });
        } else {
            if (
                details.quantity + params.quantity_update >
                    product.quantity &&
                params.quantity_update > product.quantity
            ) {
                return error.baseError({
                    location: 'body',
                    message: `Only ${
                        product.quantity - details.quantity
                    } additional products are allowed`,
                });
            } else {
                details.quantity = params.quantity_update;
                details.money =
                    details.price * params.quantity_update;
            }

            await invoice.save();
            return success.ok(invoice);
        }
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

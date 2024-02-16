import { HttpsStatus, Result, error, success } from 'app';
import { v1 } from 'uuid';
import { BillDetails, IInvoice } from '~/interface/model';
import {
    AddProductBody,
    InvoiceReqBody,
    ProductDetails,
    UpdateQuantityBody,
} from '~/interface/request';
import { Invoices } from '~/models';
import {
    getCheckProduct,
    getCheckUser,
    getQuantity,
    updateQuantityProduct,
} from '~/service';
import { getCreateOrder, getOrder } from '~/service/service.payment';

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
export async function getOrderOffline(): Promise<Result> {
    try {
        const invoice = await Invoices.find({
            status: 'unpaid',
            is_deleted: false,
        });
        return success.ok(invoice);
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

export async function createOrderOffline(params: {
    name_user: string;
    type: string;
}): Promise<Result> {
    const new_invoice: IInvoice = {
        id: v1(),
        type: params.type,
        created_by: params.name_user,
        status: 'unpaid',
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

        const product: ProductDetails = await getQuantity({
            id: params.id,
        });

        if (params.quantity > product.quantity) {
            return error.baseError({
                location: 'quantity',
                message: 'quantity so big',
            });
        }

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

export async function cancelOrder(params: { code: string }) {
    try {
        const invoice = await Invoices.findOneAndUpdate(
            { code: params.code },
            { $set: { is_deleted: true } },
            { new: true },
        );
        return success.ok({
            mess: 'cancel order successfuly',
            invoice: invoice,
        });
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

export async function cancelOrderMany(params: {
    code: string[];
}): Promise<Result> {
    try {
        await Invoices.updateMany(
            {
                code: { $in: params.code },
                is_deleted: false,
            },
            { $set: { is_deleted: true } },
            { new: true },
        );

        return success.ok({
            mes: 'cancel invoice successfuly',
        });
    } catch (e) {
        return error.notFound({});
    }
}

export async function payOrder(params: {
    code: string;
}): Promise<Result> {
    try {
        const invoice = await Invoices.findOne({
            code: params.code,
            is_deleted: false,
        });

        if (
            invoice &&
            invoice.is_deleted == false &&
            invoice.status == 'unpaid'
        ) {
            const invoiceSuccess = await Invoices.findOneAndUpdate(
                { code: params.code, is_deleted: false },
                { $set: { status: 'paid' } },
                { new: true },
            );

            let details = invoice.details;
            if (details) {
                details.forEach(async (item: BillDetails) => {
                    let data = {
                        id: item.product.id,
                        quantity: item.quantity,
                    };
                    await updateQuantityProduct({ ...data });
                });
            }

            return success.ok({
                mess: 'pay invoice successfuly',
                invoice: invoiceSuccess,
            });
        } else {
            return error.notFound({});
        }
    } catch (e) {
        return error.services('Internal Server');
    }
}

//TODO: Online
export async function createOrderOnline(
    params: {} & InvoiceReqBody,
): Promise<Result> {
    let total_amount: number = 0;

    let items: Array<{
        id: string;
        quantity: number;
        price: number;
        money: number;
        product: {
            id: string;
            name: string;
            color: string;
            size: string;
            image: string;
        };
    }> = [];

    for (let i = 0; i < params.item.length; i++) {
        const e = params.item[i];
        const check = await Promise.all([
            getCheckProduct({ id: e.product }),
        ]);

        if (check[0].status !== 200) {
            return {
                code: 'NOT_FOUND',
                status: HttpsStatus.NOT_FOUND,
                errors: [
                    {
                        location: 'body',
                        param: 'id',
                    },
                ],
            };
        } else {
            const price = check[0].body?.price as number;
            const newItem = {
                id: v1(),
                quantity: e.quantity as number,
                price: price as number,
                money: (price * e.quantity) as number,
                product: {
                    id: check[0].body?.id as string,
                    name: check[0].body?.name as string,
                    color: check[0].body?.color as string,
                    size: check[0].body?.size as string,
                    image: check[0].body?.image as string,
                },
            };

            items.push(newItem);
            total_amount += newItem.money;
        }
    }
    const checkUser = await getCheckUser({ id: params.customer });
    if (checkUser.status !== 200) {
        return {
            code: 'NOT_FOUND',
            status: HttpsStatus.NOT_FOUND,
            errors: [
                {
                    location: 'body',
                    param: 'id',
                },
            ],
        };
    } else {
        const invoice = new Invoices({
            id: v1(),
            status: 'created',
            type: 'online',
            details: items,
            order_money: total_amount,
            bill_money: total_amount,
            created_by: checkUser.body?.name,
            email_receiver: checkUser.body?.email,
            phone_receiver: checkUser.body?.phone,
            name_receiver: checkUser.body?.name,
            adress_receiver: checkUser.body?.name,
        });

        await invoice.save();
        return success.created({ ...invoice.toJSON() });
    }
}

export async function payOrderOnline(params: { code: string }) {
    try {
        const invoice = await Invoices.findOne({
            code: params.code,
            is_deleted: false,
        });

        if (
            invoice &&
            invoice.is_deleted == false &&
            invoice.status == 'created'
        ) {
            const invoiceSuccess = await Invoices.findOneAndUpdate(
                { code: params.code, is_deleted: false },
                { $set: { status: 'created' } },
                { new: true },
            );

            let details = invoice.details;
            if (details) {
                details.forEach(async (item: BillDetails) => {
                    let data = {
                        id: item.product.id,
                        quantity: item.quantity,
                    };

                    await updateQuantityProduct({ ...data });
                });
            }

            return success.ok({
                mess: 'pay order successfuly',
                invoice: invoiceSuccess,
            });
        } else {
            return error.notFound({});
        }
    } catch (e) {
        return error.services('Internal service');
    }
}

export async function payment(params: {
    orderCode: string;
}): Promise<Result> {
    try {
        const invoice = await Invoices.findOne({
            code: params.orderCode,
            is_deleted: false,
        });
        if (invoice && invoice.bill_money && invoice.code) {
            const order = await getCreateOrder({
                amount: Math.ceil(invoice.bill_money),
            });
            if (order) {
                invoice.orderCode = order.body?.orderCode as number;
                await invoice.save();
                return success.ok({
                    ...invoice.toJSON(),
                    link: order.body,
                });
            }
        }
        return error.notFound({});
    } catch (e) {
        return error.services('Internal Server');
    }
}

export async function updateInvoice(params: {
    orderCode: string;
}): Promise<Result> {
    try {
        const order = await getOrder({
            orderCode: params.orderCode,
        });
        console.log(order.body?.status);

        const invoice = await Invoices.findOne({
            orderCode: params.orderCode,
            is_deleted: false,
        });
        if (order && order.body?.status == 'PAID') {
            const invoiceSuccess = await Invoices.findOneAndUpdate(
                { orderCode: params.orderCode, is_deleted: false },
                {
                    $set: { status: 'created' },
                },
                { new: true },
            );

            return success.ok(invoiceSuccess);
        } else if (order && order.body?.status === 'CANCELLED') {
            const invoiceFaild = await Invoices.findOneAndUpdate(
                { orderCode: params.orderCode, is_deleted: false },
                {
                    $set: {
                        status: 'voided',
                    },
                },
                { new: true },
            );
            return success.ok(invoiceFaild);
        } else {
            if (invoice) {
                return success.ok(invoice);
            } else {
                return error.notFound({});
            }
        }
    } catch (e) {
        return error.services('Internal server');
    }
}

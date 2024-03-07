import { Result, error, success } from 'app';
import payOs from '../payos';

export async function createOrder(params: {
    orderCode: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    amount: number;
}): Promise<Result> {
    try {
        const paymentLinkRes = await payOs.createPaymentLink(params);
        const data = {
            bin: paymentLinkRes.bin,
            checkoutUrl: paymentLinkRes.checkoutUrl,
            accountNumber: paymentLinkRes.accountNumber,
            accountName: paymentLinkRes.accountName,
            amount: paymentLinkRes.amount,
            description: paymentLinkRes.description,
            orderCode: paymentLinkRes.orderCode,
            qrCode: paymentLinkRes.qrCode,
        };
        return success.ok(data);
    } catch (e) {
        return error.services('ERROR');
    }
}

export async function getOrder(params: {
    orderCode: number;
}): Promise<Result> {
    try {
        const order = await payOs.getPaymentLinkInformation(
            params.orderCode,
        );
        if (order) {
            return success.ok(order);
        } else {
            return error.notFound({ message: 'NOT_FOUND_ORDER' });
        }
    } catch (e) {
        return error.services('ERROR');
    }
}

export async function cancelOrder(params: {
    orderCode: number;
}): Promise<Result> {
    try {
        const order = await payOs.cancelPaymentLink(
            params.orderCode,
        );
        if (order) {
            return success.ok(order);
        } else {
            return error.notFound({ message: 'NOT_FOUND_ORDER' });
        }
    } catch (e) {
        return error.services('ERROR');
    }
}

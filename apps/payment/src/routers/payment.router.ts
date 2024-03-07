import { NextFunction, Request, Response, Router } from 'express';
import { OrderBodyReq } from '../interface/request';
import { configs } from '../configs';
import { cancelOrder, createOrder, getOrder } from '../controllers';

export const router: Router = Router();

router.post(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body: OrderBodyReq = req.body;
        body.orderCode = Number(
            String(new Date().getTime()).slice(-6),
        );
        body.cancelUrl = `${configs.payos.cancelUrl as string}`;
        body.returnUrl = `${configs.payos.returnUrl as string}`;
        body.description = 'TT Tien cho HDuong';
        const result = await createOrder(body);
        next(result);
    },
);

router.get(
    '/:orderId',
    async (req: Request, _: Response, next: NextFunction) => {
        const orderId = req.params.orderId;
        const result = await getOrder({
            orderCode: orderId as unknown as number,
        });
        next(result);
    },
);

router.put(
    '/:orderId',
    async (req: Request, _: Response, next: NextFunction) => {
        const orderId = req.params.orderId;
        const result = await cancelOrder({
            orderCode: orderId as unknown as number,
        });
        next(result);
    },
);

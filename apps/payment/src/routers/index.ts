import { Router } from 'express';
import { configs } from '~/configs';
import { router as PaymentRouter } from './payment.router';

export const router: Router = Router();

router.use(`${configs.app.prefix}/payment`, PaymentRouter);

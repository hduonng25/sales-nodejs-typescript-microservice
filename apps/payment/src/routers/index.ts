import { Router } from 'express';
import { router as PaymentRouter } from './payment.router';
import { configs } from '../configs';

export const router: Router = Router();

router.use(`${configs.app.prefix}/payment`, PaymentRouter);

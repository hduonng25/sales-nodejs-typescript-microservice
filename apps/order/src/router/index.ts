import { Router } from 'express';
import { configs } from '../config';

import { router as InvoiceRouter } from './external/invoice.router';
import { router as OrderRouter } from './external/order.router';

export const router: Router = Router();

router.use(`${configs.app.prefix}/`, InvoiceRouter);
router.use(`${configs.app.prefix}/order`, OrderRouter);

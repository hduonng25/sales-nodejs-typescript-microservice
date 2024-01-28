import { Router } from 'express';
import { configs } from '~/config';

import { router as InvoiceRouter } from './invoice.router';
import { router as OrderRouter } from './order.router';

export const router: Router = Router();

router.use(`${configs.app.prefix}/`, InvoiceRouter);
router.use(`${configs.app.prefix}/order`, OrderRouter);

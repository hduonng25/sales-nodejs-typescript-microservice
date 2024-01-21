import { Router } from 'express';
import { configs } from '~/config';

import { router as invoiceRouter } from './invoice.router';

export const router: Router = Router();

router.use(`${configs.app.prefix}/invoice`, invoiceRouter);

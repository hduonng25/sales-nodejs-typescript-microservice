import { Router } from 'express';
import { config } from '~/config';
import { router as ColorRouter } from './color.router';
import { router as SizeRouter } from './size.router';

export const router: Router = Router();

router.use(`${config.app.prefix}/color`, ColorRouter);
router.use(`${config.app.prefix}/size`, SizeRouter);

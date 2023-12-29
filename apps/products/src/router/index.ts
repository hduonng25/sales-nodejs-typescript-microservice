import { Router } from 'express';
import { config } from '~/config';
import { router as ColorRouter } from './color.router';
import { router as SizeRouter } from './size.router';
import { router as DesignRouter } from './design.router';

export const router: Router = Router();

router.use(`${config.app.prefix}/color`, ColorRouter);
router.use(`${config.app.prefix}/size`, SizeRouter);
router.use(`${config.app.prefix}/design`, DesignRouter);

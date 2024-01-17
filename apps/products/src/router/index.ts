import { Router } from 'express';
import { config } from '~/config';
import { router as ColorRouter } from './color.router';
import { router as SizeRouter } from './size.router';
import { router as DesignRouter } from './design.router';
import { router as MetarialRouter } from './metarial.router';
import { router as ProductRouter } from './product.router';
import { verifyToken } from 'app';

export const router: Router = Router();

router.use(`${config.app.prefix}/color`, verifyToken, ColorRouter);
router.use(`${config.app.prefix}/size`, verifyToken, SizeRouter);
router.use(`${config.app.prefix}/design`, verifyToken, DesignRouter);
router.use(`${config.app.prefix}/metarial`, MetarialRouter);
router.use(`${config.app.prefix}/product`, ProductRouter);

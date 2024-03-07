import { Router } from 'express';
import { config } from '../config';
import { router as ColorRouter } from './external/color.router';
import { router as SizeRouter } from './external/size.router';
import { router as DesignRouter } from './external/design.router';
import { router as MetarialRouter } from './external/metarial.router';
import { router as ProductRouter } from './external/product.router';
import { router as ServiceRouter } from './internal/index';
import { verifyToken } from 'app';

export const router: Router = Router();

router.use(`${config.app.prefix}/color`, verifyToken, ColorRouter);
router.use(`${config.app.prefix}/size`, verifyToken, SizeRouter);
router.use(`${config.app.prefix}/design`, verifyToken, DesignRouter);
router.use(`${config.app.prefix}/metarial`, MetarialRouter);
router.use(`${config.app.prefix}/product`, ProductRouter);
router.use(`${config.app.prefix}/product/service`, ServiceRouter);

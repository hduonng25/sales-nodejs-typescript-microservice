import { Router } from 'express';
import { config } from '~/config';
import { router as ColorRouter } from './color.router';
import { router as SizeRouter } from './size.router';
import { router as DesignRouter } from './design.router';
import { router as MetarialRouter } from './metarial.router';
import { router as ProductRouter } from './product.router';

export const router: Router = Router();

router.use(`${config.app.prefix}/color`, ColorRouter);
router.use(`${config.app.prefix}/size`, SizeRouter);
router.use(`${config.app.prefix}/design`, DesignRouter);
router.use(`${config.app.prefix}/metarial`, MetarialRouter);
router.use(`${config.app.prefix}/product`, ProductRouter);

import { Router } from 'express';
import { router as UserRouter } from './external/user.router';
import { router as AuthRouter } from './external/auth.roter';
import { router as ServiceRouter } from './internal/index';
import { config } from '~/config';

export const router: Router = Router();

router.use(`${config.app.prefix}/user`, UserRouter);
router.use(`${config.app.prefix}/auth`, AuthRouter);
router.use(`${config.app.prefix}/service`, ServiceRouter);

import { Router } from 'express';
import { router as UserRouter } from './user.router';
import { router as AuthRouter } from './auth.roter';
import { config } from '~/config';
import { verifyToken } from 'app';

export const router: Router = Router();

router.use(`${config.app.prefix}/user`, UserRouter);
router.use(`${config.app.prefix}/auth`, AuthRouter);

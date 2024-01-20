import { Router } from 'express';
import { router as test } from './test';
import { configs } from '~/config';

export const router: Router = Router();

router.use(`${configs.app.prefix}/test`, test);

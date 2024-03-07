import { Router } from 'express';
import { router as MailRouter } from './mail.router';
import { config } from '../configs';

export const router: Router = Router();

router.use(`${config.app.prefix}/mail/user`, MailRouter);

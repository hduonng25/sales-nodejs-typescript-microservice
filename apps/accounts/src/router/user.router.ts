import { validate } from 'app';
import { NextFunction, Request, Response, Router, request } from 'express';
import { changePassword, createUser, getByID, getListUser, updateUser } from '~/controller';
import { changePasswordBody, createUserBody, updateUserBody } from '~/interface/request';
import { createUserSchema } from '~/middleware/validator';

export const router: Router = Router();

router.get('/', async (request: Request, response: Response, next: NextFunction) => {
    const result = await getListUser();
    next(result);
});

router.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const result = await getByID(id);
    next(result);
});

router.post('/', validate.body(createUserSchema), async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body as createUserBody;
    const result = await createUser({ ...body });
    next(result);
});

router.put('/', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body as updateUserBody;
    const result = await updateUser(body);
    next(result);
});

router.put('/change-pass', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body as changePasswordBody;
    const result = await changePassword(body);
    next(result);
});

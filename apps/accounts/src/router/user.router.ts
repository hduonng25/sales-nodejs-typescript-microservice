import { validate } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    changePassword,
    createUser,
    deleteMany,
    deleteOne,
    getByID,
    getUser,
    updateUser,
} from '~/controller';
import {
    changePasswordBody,
    createUserBody,
    updateUserBody,
} from '~/interface/request';
import { createUserSchema } from '~/middleware/validator';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getUser();
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const id = req.params.id;
        const result = await getByID(id);
        next(result);
    },
);

router.post(
    '/',
    validate.body(createUserSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createUserBody;
        const result = await createUser({ ...body });
        next(result);
    },
);

router.put(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateUserBody;
        const result = await updateUser(body);
        next(result);
    },
);

router.put(
    '/change-pass',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as changePasswordBody;
        const result = await changePassword(body);
        next(result);
    },
);

router.put(
    '/delete',
    async (req: Request, _: Response, next: NextFunction) => {
        const id = req.body.id as string;
        const result = await deleteOne({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    async (req: Request, _: Response, next: NextFunction) => {
        const id = req.body.id as string[];
        const result = await deleteMany({ id });
        next(result);
    },
);

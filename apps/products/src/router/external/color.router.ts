import { validate, verifyRole } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    createColor,
    deleteMany,
    deleteOne,
    findColors,
    getByID,
    getColorListID,
    updateColor,
} from '../../controller';
import {
    CreateColorBody,
    FindReqQuery,
    UpdateColorBody,
} from '../../interface/request';
import { createColorSchema } from '../../middleware/validator';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findColors(query);
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const result = await getByID({ id });
        next(result);
    },
);

router.post(
    '/list-id',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const { id_color }: { id_color: string[] } = req.body;
        const result = await getColorListID({ id_color });
        next(result);
    },
);

router.post(
    '/',
    verifyRole('ADMIN'),
    validate.body(createColorSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as CreateColorBody;
        const result = await createColor({ ...body });
        next(result);
    },
);

router.put(
    '/',
    verifyRole('ADMIN'),
    validate.body(createColorSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as UpdateColorBody;
        const result = await updateColor(body);
        next(result);
    },
);

router.put(
    '/delete',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.body.id;
        const result = await deleteOne({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteMany({ id });
        next(result);
    },
);

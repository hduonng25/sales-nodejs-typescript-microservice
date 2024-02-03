import { verifyRole } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    createDesign,
    deleteDesign,
    deleteManyDesign,
    findDesigns,
    getDesignByID,
    updateDesign,
} from '~/controller';
import {
    FindReqQuery,
    createDesignBody,
    updateDesignBody,
} from '~/interface/request';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findDesigns(query);
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await getDesignByID({ id });
        next(result);
    },
);

router.post(
    '/',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createDesignBody;
        const result = await createDesign(body);
        next(result);
    },
);

router.put(
    '/',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateDesignBody;
        const result = await updateDesign(body);
        next(result);
    },
);

router.put(
    '/delete',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.body;
        const result = await deleteDesign({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManyDesign({ id });
        next(result);
    },
);

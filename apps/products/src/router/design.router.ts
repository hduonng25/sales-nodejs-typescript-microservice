import { NextFunction, Request, Response, Router } from 'express';
import {
    createDesign,
    deleteDesign,
    deleteManyDesign,
    getDesign,
    getDesignByID,
    updateDesign,
} from '~/controller';
import {
    createDesignBody,
    updateDesignBody,
} from '~/interface/request/body';
import { DesignsFindQuery } from '~/interface/request/query';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as DesignsFindQuery;
        const result = await getDesign(query);
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
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createDesignBody;
        const result = await createDesign(body);
        next(result);
    },
);

router.put(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateDesignBody;
        const result = await updateDesign(body);
        next(result);
    },
);

router.put(
    '/delete',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.body;
        const result = await deleteDesign({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManyDesign({ id });
        next(result);
    },
);

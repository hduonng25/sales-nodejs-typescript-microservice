import { NextFunction, Request, Response, Router } from 'express';
import {
    createSize,
    deleteManySize,
    deleteSize,
    findSizes,
    getByIDSize,
    getListSizeByID,
    updateSize,
} from '~/controller';
import {
    CretaeSizeBody,
    FindReqQuery,
    UpdateSizeBody,
} from '~/interface/request';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findSizes(query);
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await getByIDSize({ id });
        next(result);
    },
);

router.post(
    '/list-id',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id_size }: { id_size: string[] } = req.body;
        const result = await getListSizeByID({ id_size });
        next(result);
    },
);

router.post(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as CretaeSizeBody;
        const result = await createSize(body);
        next(result);
    },
);

router.put(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as UpdateSizeBody;
        const result = await updateSize(body);
        next(result);
    },
);

router.put(
    '/delete',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.body.id;
        const result = await deleteSize({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManySize({ id });
        next(result);
    },
);

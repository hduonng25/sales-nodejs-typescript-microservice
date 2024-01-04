export interface IProductDetail {
    id: string;
    status?: boolean;
    is_deleted?: boolean;
    created_date?: Date;
    quantity?: number;

    size: {
        id: string;
        name?: string;
    };

    color: {
        id: string;
        name?: string;
        code?: string;
    };

    metarial: {
        id: string;
        name?: string;
    };

    designs: {
        id: string;
        name?: string;
    };

    images?: {
        id: string;
        name?: string;
        status?: boolean;
    }[];
}

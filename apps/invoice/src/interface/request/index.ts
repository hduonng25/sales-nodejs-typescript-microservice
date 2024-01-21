export * from './invoice.body';

export interface FindReqQuery {
    type?: string;

    page: number;

    size: number;

    query?: string;

    sort?: string;
}

export interface ProductDetails {
    id: string;

    name: string;

    quantity: number;

    image: string;

    product_details: {
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

        image?: {
            id: string;
            name?: string;
            status?: boolean;
        }[];

        is_active: boolean;
    };
}

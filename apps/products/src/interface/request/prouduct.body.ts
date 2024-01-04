export type createProductBody = {
    name: string;

    price: number;

    note: string;

    size: string[];

    color: string[];

    metarial: string;

    designs: string;

    image: string[];

    quantity: number;
};

export type createProductDetails = {
    status?: boolean;

    is_deleted?: string;

    id_size: string;

    id_color: string;

    id_material: string;

    id_designs: string;

    images: string[];

    quantity: number;
};

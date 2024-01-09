export type createProductBody = {
    name: string;

    price: number;

    note: string;

    size: string[];

    color: string[];

    metarial: string;

    designs: string;

    images: string[];

    quantity: number;
};

export type createProductDetails = {
    status?: boolean;

    is_deleted?: string;

    id_size: string;

    id_color: string;

    id_material: string;

    id_designs: string;

    image?: string[];

    quantity: number;
};

export type updateProductsBody = {
    id?: string;

    name?: string;

    price?: number;

    images: string[];
};

export type updateProductsDetails = {
    id_product?: string;

    id_product_details: string;

    quantity: number;
};

export type setImageProductDetailsBody = {
    id_product: string;

    id_product_details: string;

    image: string[];

    id_image?: string;
};

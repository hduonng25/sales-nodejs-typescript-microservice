//TODO: body product
interface Product {
    id?: string;

    name?: string;

    status?: boolean;

    is_deleted?: boolean;

    quantity?: number;

    price?: number;

    note?: string;
}

export interface createProductBody extends Product {
    size: string[];

    color: string[];

    metarial: string;

    designs: string;

    images: string[];
}

export interface updateProductsBody extends Product {
    images: string[];
}

export interface activeProductBody extends Product {
    is_active: boolean;
}

//TODO: body product details
interface ProductDetails {
    id_product_details?: string;

    id_product?: string;

    status?: string;

    quantity?: number;

    is_deleted?: string;

    id_size?: string;

    id_color?: string;
}
export interface createProductDetails extends ProductDetails {
    id_material: string;

    id_designs: string;
}

export interface updateProductsDetails extends ProductDetails {}

export interface setImageProductDetailsBody extends ProductDetails {
    id_image?: string;

    image: string[];
}

export interface newProductDetails extends ProductDetails {}

export interface activeProductDetails extends ProductDetails {
    is_active: boolean;
}

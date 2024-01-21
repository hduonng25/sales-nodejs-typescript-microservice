export interface ProductBody {
    id?: string;

    name?: string;

    color?: string;

    size?: string;

    image?: string;
}

//TODO: Online
export interface UpdateStatusBody {
    code: string;

    status: string;
}

//TODO: Offline

export interface AddProductBody extends ProductBody {
    code: string;

    price: number;

    quantity: number;
}

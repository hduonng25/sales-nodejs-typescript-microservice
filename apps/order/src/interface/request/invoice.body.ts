export interface ProductBody {
    id: string;

    name: string;

    color: string;

    size: string;

    image: string;
}

export interface UpdateQuantityBody {
    code: string;

    id_details: string;

    quantity_update: number;
}

//TODO: Online
export interface UpdateStatusBody {
    code: string[];

    status: string;

    id_user: string;

    name_user: string;
}

export interface InvoiceReqBody {
    item: [
        {
            product: string;
            quantity: number;
        },
    ];

    customer: string;
}

//TODO: Offline

export interface AddProductBody extends ProductBody {
    code: string;

    price: number;

    quantity: number;
}

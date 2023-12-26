export interface IProduct {
    id: String;

    created_date: Date;

    created_by: String;

    is_deleted: Boolean;

    price: Number;

    name: String;

    note: String;

    product_details: [
        {
            id: String;

            status: Boolean;

            is_deleted: Boolean;

            created_date: Date;

            quantity: Number;

            size: {
                id: String;

                name: String;
            };

            color: {
                id: String;

                name: String;

                code: String;
            };

            metarial: {
                id: String;

                name: String;
            };

            designs: {
                id: String;

                name: String;
            };

            image: [
                {
                    id: String;

                    name: String;

                    status: Boolean;
                },
            ];
        },
    ];
}

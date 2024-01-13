export type CretaeSizeBody = {
    name: string;
};

export type UpdateSizeBody = {
    id: string;

    name: string;

    is_deleted?: boolean;
};

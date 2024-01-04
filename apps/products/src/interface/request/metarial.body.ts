export type createMaterialBody = {
    name: string;
};

export type updateMaterialBody = {
    id: string;

    name: string;

    is_deleted: boolean;
};

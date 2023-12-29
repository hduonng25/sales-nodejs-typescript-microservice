export type createDesignBody = {
    name: string;
};

export type updateDesignBody = {
    id: string;

    name: string;

    is_deleted?: boolean;
};

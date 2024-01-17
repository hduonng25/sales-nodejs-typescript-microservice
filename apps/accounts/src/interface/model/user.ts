export interface IUser {
    id?: string;

    name: string;

    adress?: string;

    phone?: string;

    email: string;

    password?: string;

    type?: boolean;

    roles?: string;

    is_deleted?: boolean;

    failed_login?: number;

    last_locked?: Date;
}

export interface createUserBody {
    name: string;

    adress: string;

    phone: string;

    email: string;

    password: string;

    type: boolean;

    role: string;
}

export interface updateUserBody {
    id: string;

    name: string;

    adress: string;

    phone: string;

    email: string;

    password: string;

    type: boolean;

    role: string;

    is_deleted: boolean;
}

export interface changePasswordBody {
    id: String;

    password_old: String;

    password_new: String;
}

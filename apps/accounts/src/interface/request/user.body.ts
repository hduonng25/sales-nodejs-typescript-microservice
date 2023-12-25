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
    id: String;

    name: String;

    adress: String;

    phone: String;

    email: String;

    password: String;

    type: Boolean;

    role: String;

    is_deleted: Boolean;
}

export interface changePasswordBody {
    id: String;

    password_old: String;

    password_new: String;
}

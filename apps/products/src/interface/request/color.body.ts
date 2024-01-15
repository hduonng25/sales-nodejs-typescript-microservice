interface Color {
    name: string;

    code: string;
}

export interface CreateColorBody extends Color {}

export interface UpdateColorBody extends Color {
    id: string;
}

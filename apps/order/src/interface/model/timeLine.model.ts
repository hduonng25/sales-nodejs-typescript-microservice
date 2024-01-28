export interface ItimeLine {
    id: string;

    user: {
        id: string;
        name?: string;
    };

    invoice: {
        code: string;
        status?: string;
    };

    action?: string;

    type?: string;
}

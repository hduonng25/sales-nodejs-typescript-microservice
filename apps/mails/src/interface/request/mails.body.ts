export interface sendMailsCreateUserBody {
    subject?: string;

    from?: string;

    to?: string;

    text?: string;

    content?: string;

    user?: string;

    html?: string;
}

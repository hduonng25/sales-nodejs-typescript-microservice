import { config } from '~/configs/config';
import { mailsOption } from '~/interface/mails';

export async function sendMailsBase(params: mailsOption) {
    const mails = {
        from: config.mails.user,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
    };

    return mails;
}

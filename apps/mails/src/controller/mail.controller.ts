import { Result, success } from 'app';
import { config } from '../configs/config';
import { sendMailsCreateUserBody } from '../interface/request';
import { TemplatesMails } from '../models';
import { mails, sendMailsBase } from '../services';

export async function sendMailsCreateUser(
    params: sendMailsCreateUserBody,
): Promise<Result> {
    const mailsOption = {
        from: config.mails.user,
        to: params.to,
        subject: `[hduong] Thong bao tao tai khoan thanh cong`,
        html: ` <b>Xin chao ${params.user}</b><br>
               <b>Bạn vừa tạo tài khoản thành công</b><br>
               <b>Rat vui vi su co mat cua ban</b><br>`,
    };

    const sendMail = await sendMailsBase(mailsOption);
    await mails.sendMail(sendMail);
    return success.ok({ message: 'OK' });
}

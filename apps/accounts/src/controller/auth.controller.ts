import { loginBody } from '~/interface/request';
import Users from '~/model/user.model';
import bcrypt from 'bcrypt';
import { genToken, refreshToken } from '~/token';
import { NextFunction } from 'express';
import { error, success } from 'app';

export async function login(params: loginBody) {
    const user = await Users.findOne({
        email: params.email,
    });
    if (!user)
        return error.notFound({
            location: 'user_not_found',
            param: params.email.toString(),
            value: params.email,
            message: 'khong tim thay user tuong ung',
        });

    const checkPass = bcrypt.compareSync(
        params.password.toString(),
        user.password as string,
    );

    if (!checkPass)
        return error.notFound({
            location: 'wrong_password',
            param: params.password.toString(),
            value: params.password,
            message: 'sai mat khau, vui long nhap lai',
        });
    const email = params.email;
    const name = user.name;
    const type = user.type;
    const role = user.role;
    const payload = { email, name, type, role };
    const access_token = genToken(payload);
    const refesh_token = refreshToken(payload);
    let data = {
        access_token,
        refesh_token,
    };
    return success.ok(data);
}

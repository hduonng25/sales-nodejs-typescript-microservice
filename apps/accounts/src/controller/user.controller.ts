import { v1 } from 'uuid';
import {
    changePasswordBody,
    createUserBody,
    updateUserBody,
} from '~/interface/request';
import Users from '~/model/user.model';
import bcrypt from 'bcrypt';
import { Result, error, success } from 'app';
import { sendMailcreateUser } from '~/service';
import { checkExitsAccount } from '~/middleware/common';
import { IUser } from '~/interface/model';

export async function getUser(): Promise<Result> {
    const list = await Users.find({});
    return success.ok(list);
}

export async function getByID(id: any): Promise<Result> {
    const user = await Users.findOne({ id: id });
    return success.ok(user);
}

export async function createUser(
    params: createUserBody,
): Promise<Result> {
    await checkExitsAccount({
        email: params.email,
        phone: params.phone,
    });

    const password = await bcrypt.hash(
        params.password.toString(),
        10,
    );

    const new_user: IUser = {
        id: v1(),
        name: params.name,
        adress: params.adress,
        phone: params.phone,
        email: params.email,
        password: password,
        type: params.type,
        role: params.role,
        is_deleted: false,
    };

    const user = new Users(new_user);
    await user.save();
    await sendMailcreateUser(params.email, params.name);
    return success.ok(user);
}

export async function updateUser(
    params: updateUserBody,
): Promise<Result> {
    await checkExitsAccount({
        email: params.email,
        phone: params.phone,
        id: params.id,
    });

    const update_user: IUser = {
        name: params.name,
        phone: params.phone,
        adress: params.adress,
        email: params.email,
        is_deleted: params.is_deleted,
    };
    const update = await Users.findOneAndUpdate(
        { id: params.id },
        {
            $set: update_user,
        },
        { new: true },
    );

    return success.ok(update);
}

export async function changePassword(
    params: changePasswordBody,
): Promise<Result> {
    const user = await Users.findOne({
        id: params.id,
    });
    if (!user)
        return error.notFound({
            location: 'user_not_found',
            param: 'email',
            value: 'user',
            message: 'Khong tim thay user tuong ung',
        });

    const checkPass = bcrypt.compareSync(
        params.password_old.toString(),
        user.password as string,
    );
    const password = await bcrypt.hash(
        params.password_new.toString(),
        10,
    );

    if (!checkPass)
        return error.notFound({
            location: 'password_wrong',
            message: 'Mat khau cu khong dung',
        });

    const update = await Users.findOneAndUpdate(
        { id: params.id },
        { $set: { password: password } },
        { new: true },
    );

    return success.ok(update);
}

export async function deleteOne(params: {
    id: string;
}): Promise<Result> {
    const user = await Users.findOneAndUpdate(
        { id: params.id },
        { $set: { is_deleted: true } },
        { new: true },
    );
    return success.ok(user);
}

export async function deleteMany(params: {
    id: string[];
}): Promise<Result> {
    await Promise.all(
        params.id.map(async (id: string) => {
            await Users.findOneAndUpdate(
                { id: id },
                { $set: { is_deleted: true } },
            );
        }),
    );

    return success.ok('delele many successfuly');
}

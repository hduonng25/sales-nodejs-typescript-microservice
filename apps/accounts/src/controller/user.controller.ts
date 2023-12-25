import { v1 } from 'uuid';
import { changePasswordBody, createUserBody, updateUserBody } from '~/interface/request';
import Users from '~/model/user.model';
import bcrypt from 'bcrypt';
import { error, success } from 'app';
import { sendMailcreateUser } from '~/service';
import { checkExitsAccount } from '~/middleware/common';

export async function getListUser() {
    const list = await Users.find({});
    return success.ok(list);
}

export async function getByID(id: any) {
    const user = await Users.findOne({ id: id });
    return success.ok(user);
}

export async function createUser(params: createUserBody) {
    await checkExitsAccount({
        email: params.email,
    });
    const password = await bcrypt.hash(params.password.toString(), 10);
    const check_email = await Users.findOne({ email: params.email });
    const check_sdt = await Users.findOne({ phone: params.phone });
    if (check_email || check_sdt)
        return error.notFound({
            location: 'email_duplicate, phone_duplicate',
            message: 'trung email, trung so dien thoai',
        });

    const user = new Users({
        id: v1(),
        name: params.name,
        adress: params.adress,
        phone: params.phone,
        email: params.email,
        password: password,
        type: params.type,
        role: params.role,
        is_deleted: false,
    });

    await user.save();
    await sendMailcreateUser(params.email, params.name);
    return success.ok(user);
}

export async function updateUser(params: updateUserBody) {
    const check_email = await Users.findOne({ email: params.email });
    const check_sdt = await Users.findOne({ phone: params.phone });

    if (check_email || check_sdt)
        return error.notFound({
            location: 'email_duplicate, phone_duplicate',
            message: 'trung email, trung so dien thoai',
        });

    const update = await Users.findOneAndUpdate(
        { id: params.id },
        {
            $set: {
                name: params.name,
                phone: params.phone,
                adress: params.adress,
                email: params.email,
                is_deleted: params.is_deleted,
            },
        },
        { new: true },
    );

    return success.ok(update);
}

export async function changePassword(params: changePasswordBody) {
    const user = await Users.findOne({ id: params.id });
    if (!user)
        return error.notFound({
            location: 'user_not_found',
            param: 'email',
            value: 'user',
            message: 'Khong tim thay user tuong ung',
        });

    const checkPass = bcrypt.compareSync(params.password_old.toString(), user.password.toString());
    const password = await bcrypt.hash(params.password_new.toString(), 10);

    if (!checkPass)
        return error.notFound({
            location: 'password_wrong',
            message: 'Mat khau cu khong dung',
        });

    const update = await Users.findOneAndUpdate({ id: params.id }, { $set: { password: password } }, { new: true });

    return success.ok(update);
}

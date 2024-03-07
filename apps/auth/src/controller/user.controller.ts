import { v1 } from 'uuid';
import {
    FindReqQuery,
    changePasswordBody,
    createUserBody,
    updateUserBody,
} from '../interface/request';
import Users from '../model/user.model';
import bcrypt from 'bcrypt';
import { HttpError, Result, error, success } from 'app';
import { sendMailcreateUser } from '../service';
import { checkExitsAccount } from '../middleware/common';
import { IUser } from '../interface/model';
import { FilterQuery, PipelineStage } from 'mongoose';
import { ParseSyntaxError, parseQuery } from 'mquery';

export async function getUser(
    params: FindReqQuery,
): Promise<Result> {
    let filter: FilterQuery<IUser> = {
        is_deleted: false,
    };

    let sort: Record<string, 1 | -1> = { create_date: -1 };

    try {
        if (params.query) {
            const uFilter = parseQuery(params.query);
            filter = { $and: [filter, uFilter] };
        }
    } catch (e) {
        const err = e as unknown as ParseSyntaxError;
        const errorValue =
            err.message === params.sort ? params.sort : params.query;
        throw new HttpError(
            error.invalidData({
                location: 'query',
                param: err.type,
                message: err.message,
                value: errorValue,
            }),
        );
    }

    const project = {
        _id: 0,
        id: 1,
        name: 1,
        email: 1,
        roles: 1,
    };

    params.page = params.page <= 0 ? 1 : params.page;

    const facetData =
        params.size == 1
            ? []
            : [
                  { $skip: (params.page - 1) * params.size },
                  { $limit: params.size * 1 },
              ];

    const facet = {
        meta: [{ $count: 'total' }],
        data: facetData,
    };

    Object.assign(filter, { is_deleted: false });

    const pipelane: PipelineStage[] = [
        { $match: filter },
        { $project: project },
        { $sort: sort },
        { $facet: facet },
    ];

    const list = await Users.aggregate(pipelane)
        .collation({ locale: 'vi' })
        .then((res) => res[0])
        .then(async (res) => {
            const total = !(res.meta.length > 0)
                ? 0
                : res.meta[0].total;
            let totalPage = Math.ceil(total / params.size);
            totalPage = totalPage > 0 ? totalPage : 1;

            return {
                page: Number(params.page),
                total: total,
                total_page: totalPage,
                data: res.data,
            };
        });
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
        roles: params.role,
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

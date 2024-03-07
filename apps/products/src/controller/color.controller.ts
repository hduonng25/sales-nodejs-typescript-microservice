import { HttpError, Result, error, success } from 'app';

import { v1 } from 'uuid';
import { FilterQuery, PipelineStage } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { CreateColorBody, FindReqQuery, UpdateColorBody } from '../interface/request';
import { IColor } from '../interface/models';
import { Colors } from '../models';
import { CheckExitsColor } from '../middleware/common';

export async function findColors(
    params: FindReqQuery,
): Promise<Result> {
    let filter: FilterQuery<IColor> = {};
    let sort: Record<string, 1 | -1> = { created_date: -1 };

    try {
        if (params.query) {
            const uFilter = parseQuery(params.query);
            filter = { $and: [filter, uFilter] };
        }
        params.sort && (sort = parseSort(params.sort));
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
        code: 1,
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

    const result = await Colors.aggregate(pipelane)
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

    return success.ok(result);
}

export async function getByID(params: {
    id: string;
}): Promise<Result> {
    const result = await Colors.findOne({
        id: params.id,
        is_deleted: false,
    });

    return success.ok(result);
}

export async function getColorListID(params: {
    id_color: string[];
}): Promise<IColor[]> {
    const color = await Colors.find({
        id: {
            $in: params.id_color,
        },
    });

    return color;
}

export async function createColor(
    params: CreateColorBody,
): Promise<Result> {
    await CheckExitsColor({
        name: params.name,
        code: params.code,
    });

    const new_color: IColor = {
        id: v1(),
        name: params.name,
        code: params.code,
    };

    const color = new Colors(new_color);
    await color.save();
    return success.ok(color);
}

export async function updateColor(
    params: UpdateColorBody,
): Promise<Result> {
    await CheckExitsColor({
        id: params.id,
        name: params.id,
        code: params.code,
    });

    const update_color: IColor = {
        name: params.name,
        code: params.code,
    };

    const color = await Colors.findOneAndUpdate(
        { id: params.id },
        { $set: update_color },
        { new: true },
    );

    return success.ok(color);
}

export async function deleteOne(params: {
    id: string;
}): Promise<Result> {
    const result = await Colors.findOneAndUpdate(
        { id: params.id },
        { $set: { is_deleted: true } },
        { new: true },
    );

    return success.ok(result);
}

export async function deleteMany(params: {
    id: string[];
}): Promise<Result> {
    await Promise.all(
        params.id.map(async (id: string) => {
            await Colors.findOneAndUpdate(
                { id: id },
                { $set: { is_deleted: true } },
            );
        }),
    );

    return success.ok({ mess: 'delete many successfuly' });
}

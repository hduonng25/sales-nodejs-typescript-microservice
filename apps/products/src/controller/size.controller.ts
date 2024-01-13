import { HttpError, Result, error, success } from 'app';
import { FilterQuery, PipelineStage } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { v1 } from 'uuid';
import { ISize } from '~/interface/models';
import {
    CretaeSizeBody,
    UpdateSizeBody,
} from '~/interface/request/body';
import { SizeFindQuery } from '~/interface/request/query';
import { CheckExitsSize } from '~/middleware/common';
import { Sizes } from '~/models';

export async function getSize(
    params: SizeFindQuery,
): Promise<Result> {
    let filter: FilterQuery<ISize> = {};
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

    const result = await Sizes.aggregate(pipelane)
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

export async function getByIDSize(params: {
    id: string;
}): Promise<Result> {
    const result = await Sizes.findOne({ id: params.id });
    return success.ok(result);
}

export async function getListSizeByID(params: {
    id_size: string[];
}): Promise<ISize[]> {
    const size = await Sizes.find({
        id: {
            $in: params.id_size,
        },
    });

    return size;
}

export async function createSize(
    params: CretaeSizeBody,
): Promise<Result> {
    await CheckExitsSize({
        name: params.name,
    });

    const new_size: ISize = {
        id: v1(),
        name: params.name,
    };

    const size = new Sizes(new_size);
    await size.save();
    return success.ok(size);
}

export async function updateSize(
    params: UpdateSizeBody,
): Promise<Result> {
    await CheckExitsSize({
        id: params.id,
        name: params.name,
    });

    const update_size: ISize = {
        name: params.name,
        is_deleted: params.is_deleted,
    };

    const size = await Sizes.findOneAndUpdate(
        { id: params.id },
        { $set: update_size },
        { new: true },
    );

    return success.ok(size);
}

export async function deleteSize(params: {
    id: string;
}): Promise<Result> {
    const size = await Sizes.findOneAndUpdate(
        { id: params.id },
        { $set: { is_deleted: true } },
        { new: true },
    );

    return success.ok(size);
}

export async function deleteManySize(params: {
    id: string[];
}): Promise<Result> {
    await Promise.all(
        params.id.map(async (id: string) => {
            await Sizes.findOneAndUpdate(
                { id: id },
                { $set: { is_deleted: true } },
            );
        }),
    );

    return success.ok({ mess: 'delete many size successfuly' });
}

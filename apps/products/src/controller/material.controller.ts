import { HttpError, Result, error, success } from 'app';
import { FilterQuery, PipelineStage, Promise } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { v1 } from 'uuid';
import { IMetarial } from '~/interface/models';
import {
    FindReqQuery,
    createMaterialBody,
    updateMaterialBody,
} from '~/interface/request';
import { checkExitsMaterial } from '~/middleware/common';
import { Metarials } from '~/models';

export async function findMetarials(
    params: FindReqQuery,
): Promise<Result> {
    let filter: FilterQuery<IMetarial> = {};
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

    const result = await Metarials.aggregate(pipelane)
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

export async function getMetarialsByID(params: {
    id: string;
}): Promise<Result> {
    const result = await Metarials.findOne({ id: params.id });
    return success.ok(result);
}

export async function createMetarials(
    params: createMaterialBody,
): Promise<Result> {
    await checkExitsMaterial({
        name: params.name,
    });

    const new_metarial: IMetarial = {
        id: v1(),
        name: params.name,
    };
    const metarial = new Metarials(new_metarial);
    await metarial.save();
    return success.ok(metarial);
}

export async function updateMetarial(
    params: updateMaterialBody,
): Promise<Result> {
    await checkExitsMaterial({
        id: params.id,
        name: params.name,
    });

    const update: IMetarial = {
        name: params.name,
        is_deleted: params.is_deleted,
    };

    const result = await Metarials.findOneAndUpdate(
        { id: params.id },
        { $set: update },
        { new: true },
    );

    return success.ok(result);
}

export async function deleteMetarial(params: {
    id: string;
}): Promise<Result> {
    const result = await Metarials.findOneAndUpdate(
        { id: params.id },
        { $set: { is_deleted: true } },
        { new: true },
    );

    return success.ok(result);
}

export async function deleteManyMetarials(params: {
    id: string[];
}): Promise<Result> {
    await Promise.all(
        params.id.map(async (id: string) => {
            await Metarials.findOneAndUpdate(
                { id: id },
                { $set: { is_deleted: true } },
            );
        }),
    );

    return success.ok({ mess: 'delete many metarials successfuly' });
}

import { HttpError, Result, success, error } from 'app';
import { FilterQuery, PipelineStage, Promise } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { v1 } from 'uuid';
import { IDesign } from '~/interface/models';
import {
    createDesignBody,
    updateDesignBody,
} from '~/interface/request/body';
import { DesignsFindQuery } from '~/interface/request/query';
import { checkExitsDesign } from '~/middleware/common';
import { Designs } from '~/models';

export async function getDesign(
    params: DesignsFindQuery,
): Promise<Result> {
    let filter: FilterQuery<IDesign> = {};
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

    const result = await Designs.aggregate(pipelane)
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

export async function getDesignByID(params: {
    id: string;
}): Promise<Result> {
    const result = await Designs.findOne({ id: params.id });
    return success.ok(result);
}

export async function createDesign(
    params: createDesignBody,
): Promise<Result> {
    await checkExitsDesign({
        name: params.name,
    });

    const new_design: IDesign = {
        id: v1(),
        name: params.name,
    };
    const design = new Designs(new_design);
    await design.save();
    return success.ok(design);
}

export async function updateDesign(
    params: updateDesignBody,
): Promise<Result> {
    await checkExitsDesign({
        id: params.id,
        name: params.name,
    });

    const update: IDesign = {
        name: params.name,
        is_deleted: params.is_deleted,
    };

    const result = await Designs.findOneAndUpdate(
        { id: params.id },
        { $set: update },
        { new: true },
    );

    return success.ok(result);
}

export async function deleteDesign(params: {
    id: string;
}): Promise<Result> {
    const result = await Designs.findOneAndUpdate(
        { id: params.id },
        { $set: { is_deleted: true } },
        { new: true },
    );

    return success.ok(result);
}

export async function deleteManyDesign(params: {
    id: string[];
}): Promise<Result> {
    await Promise.all(
        params.id.map(async (id: string) => {
            await Designs.findOneAndUpdate(
                { id: id },
                { $set: { is_deleted: true } },
            );
        }),
    );

    return success.ok({ mess: 'delete many design successfuly' });
}

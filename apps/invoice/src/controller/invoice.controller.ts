import { HttpError, Result, error, success } from 'app';
import { FilterQuery, PipelineStage } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { v1 } from 'uuid';
import { IInvoice, ItimeLine } from '~/interface/model';
import {
    AddProductBody,
    FindReqQuery,
    ProductBody,
    UpdateStatusBody,
} from '~/interface/request';
import { Invoices, TimeLines } from '~/models';

export async function findInvoices(
    params: FindReqQuery,
): Promise<Result> {
    let filter: FilterQuery<IInvoice> = {};
    let sort: Record<string, 1 | -1> = { created_time: -1 };

    params.page = !params.page || params.page < 1 ? 1 : params.page;
    params.size = !params.size || params.size < 1 ? 1 : params.size;

    try {
        if (params.query) {
            const uFilter = parseQuery(params.query);
            filter = { $and: [filter, uFilter] };
        }

        params.sort && (sort = parseSort(params.sort));
    } catch (e) {
        const err = e as unknown as ParseSyntaxError;
        const value =
            err.message === params.sort ? params.sort : params.query;
        throw new HttpError(
            error.invalidData({
                location: 'query',
                param: err.type,
                message: err.message,
                value: value,
            }),
        );
    }

    const project = {
        _id: 0,
        code: 1,
        status: 1,
        type: 1,
        created_time: 1,
    };

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

    const invoice = await Invoices.aggregate(pipelane)
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

    return success.ok(invoice);
}

//TODO: Offline
export async function createInvoiceOffline(params: {
    name_user: string;
    type: string;
}): Promise<Result> {
    const new_invoice: IInvoice = {
        id: v1(),
        type: params.type,
        created_by: params.name_user,
    };

    const invoice = new Invoices(new_invoice);
    await invoice.save();
    return success.created(invoice);
}

export async function addProduct(
    params: AddProductBody,
): Promise<Result> {
    const bill_details = {
        id: v1(),
        quantity: params.quantity,
        price: params.price,
        money: params.price * params.quantity,
        product: {
            id: params.id,
            name: params.name,
            color: params.color,
            size: params.size,
            image: params.image,
        },
    };

    const bill = await Invoices.findOneAndUpdate(
        { code: params.code },
        {
            $push: {
                details: bill_details,
            },
        },
        { new: true },
    );

    return success.ok(bill);
}

//TODO: Online
export async function updateStatus(
    params: {
        id_user: string;
        name_user: string;
    } & UpdateStatusBody,
): Promise<Result> {
    const update_invoice: IInvoice = {
        status: params.status,
    };

    const new_timeLine: ItimeLine = {
        id: v1(),
        user: {
            id: params.id_user,
            name: params.name_user,
        },

        invoice: {
            code: params.code,
            status: params.status,
        },

        action: `update status to ${params.status}`,
        type: 'status',
    };

    await Invoices.findOneAndUpdate(
        { code: params.code },
        { $set: update_invoice },
        { new: true },
    );

    new TimeLines(new_timeLine).save();

    const project_invoice = {
        _id: 0,
        code: 1,
        status: 1,
        type: 1,
        created_time: 1,
    };

    const project_timeLine = {
        _id: 0,
        user: 1,
        action: 1,
        type: 1,
    };

    const invoice = await Invoices.aggregate([
        { $match: { code: params.code } },
        { $project: project_invoice },
    ]);

    const timeLine = await TimeLines.aggregate([
        { $match: { 'invoice.code': params.code } },
        { $project: project_timeLine },
        { $sort: { created_time: -1 } },
        { $limit: 1 },
    ]);

    return success.ok({
        invoice: invoice,
        timeLine: timeLine,
    });
}

import { HttpError, Result, error, success } from 'app';
import { FilterQuery, PipelineStage } from 'mongoose';
import { ParseSyntaxError, parseQuery, parseSort } from 'mquery';
import { v1 } from 'uuid';
import { IInvoice, ItimeLine } from '../interface/model';
import { FindReqQuery, UpdateStatusBody } from '../interface/request';
import { Invoices, TimeLines } from '../models';

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

export async function getDetails(params: { code: string }) {
    try {
        const filter: FilterQuery<IInvoice> = {
            code: params.code,
            is_deleted: false,
        };

        const project = {
            _id: 0,
            id: 1,
            code: 1,
            email_receiver: 1,
            phone_receiver: 1,
            name_receiver: 1,
            adress_receiver: 1,
            ship_money: 1,
            reduced_money: 1,
            order_money: 1,
            bill_money: 1,
            details: 1,
        };

        let timeLine = await TimeLines.find({
            'invoice.code': params.code,
        });

        timeLine = !timeLine ? [] : timeLine;

        const pipelane: PipelineStage[] = [
            { $match: filter },
            { $project: project },
        ];

        const invoice = await Invoices.aggregate(pipelane);
        return success.ok({
            invoice: invoice,
            timeLine: timeLine,
        });
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

export async function updateStatus(
    params: UpdateStatusBody,
): Promise<Result> {
    try {
        await Promise.all(
            params.code.map(async (code: string) => {
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
                        code: code,
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
            }),
        );
        return success.ok({ mess: 'Update status successfuly' });
    } catch (e) {
        const err = e as Error;
        return error.exception(err);
    }
}

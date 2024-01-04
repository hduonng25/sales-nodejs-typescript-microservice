import { Result, success } from 'app';
import { Promise } from 'mongoose';
import { v1 } from 'uuid';
import { IMetarial } from '~/interface/models';
import {
    createMaterialBody,
    updateMaterialBody,
} from '~/interface/request';
import { checkExitsMaterial } from '~/middleware/common';
import { Metarials } from '~/models';

export async function getMetarials(): Promise<Result> {
    const result = await Metarials.find();
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

    return success.ok('delete many metarials successfuly');
}

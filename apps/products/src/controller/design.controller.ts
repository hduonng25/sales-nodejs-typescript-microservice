import { Result, success } from 'app';
import { Promise } from 'mongoose';
import { v1 } from 'uuid';
import { IDesign } from '~/interface/models';
import {
    createDesignBody,
    updateDesignBody,
} from '~/interface/request';
import { checkExitsDesign } from '~/middleware/common';
import { Designs } from '~/models';

export async function getDesign(): Promise<Result> {
    const result = await Designs.find();
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

    return success.ok('delete many design successfuly');
}

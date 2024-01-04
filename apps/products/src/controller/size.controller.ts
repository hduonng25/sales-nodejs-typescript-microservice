import { Result, success } from 'app';
import { v1 } from 'uuid';
import { ISize } from '~/interface/models';
import { CretaeSizeBody, UpdateSizeBody } from '~/interface/request';
import { CheckExitsSize } from '~/middleware/common';
import { Sizes } from '~/models';

export async function getSize(): Promise<Result> {
    const result = await Sizes.find();
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

    return success.ok('delete many size successfuly');
}

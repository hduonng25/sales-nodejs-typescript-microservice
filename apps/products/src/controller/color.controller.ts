import { Result, success } from 'app';
import { IColor } from '~/interface/models';
import {
    CreateColorBody,
    UpdateColorBody,
} from '~/interface/request';
import { Colors } from '~/models';
import { v1 } from 'uuid';
import { CheckExitsColor } from '~/middleware/common';

export async function getColor(): Promise<Result> {
    const result = await Colors.find();
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

    return success.ok('delete many successfuly');
}

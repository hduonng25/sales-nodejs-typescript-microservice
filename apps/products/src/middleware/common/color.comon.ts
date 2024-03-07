import { HttpError, HttpsStatus, Result } from 'app';
import { FilterQuery } from 'mongoose';
import { IColor } from '../../interface/models';
import { Colors } from '../../models';

export async function CheckExitsColor(params: {
    name?: string;
    code?: string;
    id?: string;
}): Promise<void> {
    const check = async (field: string, value: string) => {
        const filter: FilterQuery<IColor> = {
            [field]: {
                $regex: `^${value}$`,
                $options: 'i',
            },
            is_deleted: false,
        };

        const color = await Colors.findOne(filter);
        if (color && color.id !== params.id) {
            throw new HttpError({
                status: HttpsStatus.BAD_REQUEST,
                code: 'INVALID_DATA',
                description: {
                    en: `${field} already exitsts`,
                    vi: `${field} da ton tai`,
                },

                errors: [
                    {
                        location: `${field}`,
                        param: 'body',
                        value: `${field}`,
                    },
                ],
            });
        }
    };

    if (params.name) await check('name', params.name);
    if (params.code) await check('code', params.code);
}

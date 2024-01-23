import { loginBody } from '~/interface/request';
import Users from '~/model/user.model';
import bcrypt from 'bcrypt';
import { genAccessToken, genRefreshToken, getPayload } from '~/token';
import { HttpsStatus, Result, success } from 'app';
import { accountNotFoundError, wrongPasswordError } from '~/middleware/common';

export async function login(params: loginBody): Promise<Result> {
    try {
        const numberOfTried = 5;
        const account = await Users.findOne({
            email: {
                $regex: `^${params.email}$`,
                $options: 'i',
            },
            is_deleted: false,
        });

        if (account && account.password) {
            if (account.failed_login === numberOfTried - 1) {
                account.last_locked = new Date();
            } else if (account.failed_login === numberOfTried) {
                const lastLocked = account.last_locked
                    ? account.last_locked
                    : new Date();

                const now = new Date();
                const diffInMicrosecond = now.getTime() - lastLocked.getTime();
                const diffInMinutes = Math.ceil(
                    diffInMicrosecond / (60 * 1000),
                );
                if (diffInMinutes <= 30) {
                    return {
                        code: 'ACCOUNT_IS_LOCKED',
                        status: HttpsStatus.UNAUTHORIZED,
                        errors: [
                            {
                                location: 'body',
                                param: 'email',
                            },
                        ],
                    };
                } else {
                    account.failed_login = 0;
                }
            }
            const checkPass = bcrypt.compareSync(
                params.password.toString(),
                account.password,
            );

            if (checkPass) {
                const { id, email, name } = account;
                const roles = [account.roles as string];
                const accessToKen = genAccessToken({
                    id,
                    email,
                    name,
                    roles,
                });
                const refreshToken = genRefreshToken(id);
                const data = {
                    ...{
                        ...account.toJSON(),
                        _id: undefined,
                        password: undefined,
                        is_deleted: undefined,
                        type: undefined,
                    },
                    accessToKen: accessToKen.token,
                    refreshToken: refreshToken.token,
                    roles: account.roles,
                };

                account.failed_login = 0;
                await account.save();
                return success.ok(data);
            } else {
                account.failed_login = (account.failed_login || 0) + 1;
                await account.save();
                return wrongPasswordError();
            }
        } else {
            return accountNotFoundError();
        }
    } catch (error) {
        throw error;
    }
}

export async function newToken(refreshToken: string): Promise<Result> {
    const payload = getPayload(refreshToken);
    const errors = [
        {
            param: 'token',
            location: 'header',
        },
    ];
    if (payload instanceof Error) {
        const err = payload;
        if (err.name && err.name === 'TokenExpiredError') {
            return {
                status: HttpsStatus.UNAUTHORIZED,
                code: 'TOKEN_EXPIRED',
                errors: errors,
            };
        } else {
            return {
                status: HttpsStatus.UNAUTHORIZED,
                code: 'INVALID_TOKEN',
                errors: errors,
            };
        }
    }

    const account = await Users.findOne(
        { id: payload.id },
        { _id: 0, password: 0 },
    );

    if (account) {
        const { id, email, name } = account;
        const roles = [account.roles as string];
        const accessToken = genAccessToken({
            id,
            email,
            name,
            roles,
        });
        const refreshToken = genRefreshToken(id);
        const data = {
            ...{
                ...account.toJSON(),
                _id: undefined,
                password: undefined,
            },
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
            roles: account.roles,
        };

        return { status: HttpsStatus.OK, data };
    } else {
        return accountNotFoundError();
    }
}

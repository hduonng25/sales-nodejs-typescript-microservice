import {
    Expression,
    Identifier,
    MemberExpression,
    parse,
} from 'abstract-syntax-tree';
import { Any } from 'utils';
import { SortSyntaxError, QuerySyntaxError } from './error';

export function getPath(expression: MemberExpression | Identifier): string {
    switch (expression.type) {
        case 'MemberExpression': {
            const object = getPath(expression.object);
            const property = getPath(expression.property);
            return `${object}.${property}`;
        }
        case 'Identifier': {
            return expression.name;
        }
        default: {
            throw new Error(`type ${expression} is invalid`);
        }
    }
}

const generateQuery = (exp: Expression, err: QuerySyntaxError): Any => {
    switch (exp.type) {
        case 'ExpressionStatement': {
            return generateQuery(exp.expression, err);
        }
        case 'CallExpression': {
            const result: Any = {};
            const calleeName = getPath(exp.callee);
            switch (calleeName) {
                case 'and':
                case 'or': {
                    result[`$${calleeName}`] = [];
                    for (let i = 0; i < exp.arguments.length; i++) {
                        const element = exp.arguments[i];
                        if (
                            element.type !== 'CallExpression' &&
                            element.type !== 'ExpressionStatement'
                        ) {
                            throw err;
                        } else {
                            result[`$${calleeName}`].push(
                                generateQuery(element, err),
                            );
                        }
                    }
                    break;
                }
                case 'neq':
                case 'eq':
                case 'like': {
                    const arg1 = exp.arguments[0];
                    const arg2 = exp.arguments[1];
                    if (
                        exp.arguments.length !== 2 ||
                        arg1.type === 'CallExpression' ||
                        arg1.type === 'ExpressionStatement' ||
                        arg1.type === 'Literal'
                    ) {
                        throw err;
                    }
                    if (arg2.type !== 'Literal') {
                        throw err;
                    }
                    switch (calleeName) {
                        case 'eq': {
                            result[getPath(arg1)] = arg2.value;
                            break;
                        }
                        case 'neq': {
                            result[getPath(arg1)] = {
                                $ne: arg2.value,
                            };
                            break;
                        }
                        case 'like': {
                            if (typeof arg2.value === 'string') {
                                const keyword = arg2.value
                                    .trim()
                                    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                                result[getPath(arg1)] = {
                                    $regex: keyword,
                                    $options: 'i',
                                };
                            } else {
                                throw err;
                            }
                            break;
                        }
                        default: {
                            throw err;
                        }
                    }
                    break;
                }
                case 'in': {
                    const arg1 = exp.arguments[0];
                    if (
                        exp.arguments.length !== 2 ||
                        arg1.type === 'CallExpression' ||
                        arg1.type === 'ExpressionStatement' ||
                        arg1.type === 'Literal'
                    ) {
                        throw err;
                    }
                    const possibleValues = [];
                    for (let i = 1; i < exp.arguments.length; i++) {
                        const arg = exp.arguments[i];
                        if (arg.type !== 'Literal') {
                            throw err;
                        }
                        possibleValues.push(arg.value);
                    }

                    result[getPath(arg1)] = {
                        $in: possibleValues,
                    };
                    break;
                }
                default: {
                    throw err;
                }
            }
            return result;
        }
        default: {
            throw err;
        }
    }
};

export function parseQuery(query: string): Any {
    const parseResult = parse(query);
    const error = new QuerySyntaxError(query);
    const result = generateQuery(parseResult.body[0], error);
    return result;
}

export const parseSort = (sort: string): Record<string, 1 | -1> => {
    const pattern = /^.+=(1|-1)*$/;
    const result = Object.create(null);
    const qs = sort.split(';');
    for (const q of qs) {
        if (!pattern.test(q)) {
            throw new SortSyntaxError(sort);
        }

        const objs = q.split('=');
        if (objs.length === 2) {
            result[objs[0]] = Number(objs[1]);
        }
    }
    return result;
};

export * from './error';

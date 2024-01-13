declare module 'abstract-syntax-tree' {
    function parse(str: string): {
        type: string;
        sourceType: string;
        body: Expression[];
    };

    type Expression =
        | CallExpression
        | MemberExpression
        | ExpressionStatement
        | Identifier
        | Literal;

    interface ExpressionStatement {
        type: 'ExpressionStatement';
        expression: CallExpression;
    }

    interface CallExpression {
        type: 'CallExpression';
        callee: MemberExpression | Identifier;
        arguments: Expression[];
    }

    interface MemberExpression {
        type: 'MemberExpression';
        object: Identifier | MemberExpression;
        computed: boolean;
        property: Identifier;
    }

    interface Identifier {
        type: 'Identifier';
        name: string;
    }

    interface Literal {
        type: 'Literal';
        value: unknown;
    }
}

import type { BetterAuthOptions, Where } from 'better-auth';
import type { CollectionSlug, Where as PayloadWhere } from 'payload';
export declare const createTransform: (options: BetterAuthOptions, enableDebugLogs: boolean) => {
    getField: (model: string, field: string) => any;
    getModelName: (model: string) => CollectionSlug;
    singleIdQuery: (where: PayloadWhere) => string | number;
    multipleIdsQuery: (where: PayloadWhere) => (string | number)[];
    transformInput: (data: Record<string, any>, model: string, action: "create" | "update") => Record<string, any>;
    transformOutput: <T extends Record<string, any> | undefined>(doc: T) => T;
    convertWhereClause: (model: string, where?: Where[]) => PayloadWhere;
    convertSelect: (model: string, select?: string[]) => {};
    convertSort: (model: string, sortBy?: {
        field: string;
        direction: "asc" | "desc";
    }) => string;
};
//# sourceMappingURL=index.d.ts.map
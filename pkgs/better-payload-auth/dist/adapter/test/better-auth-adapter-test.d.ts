import type { Adapter, BetterAuthOptions } from 'better-auth';
interface AdapterTestOptions {
    getAdapter: (customOptions?: Omit<BetterAuthOptions, 'database'>) => Promise<Adapter>;
    skipGenerateIdTest?: boolean;
}
export declare function runAdapterTest(opts: AdapterTestOptions): Promise<void>;
export {};
//# sourceMappingURL=better-auth-adapter-test.d.ts.map
declare module 'better-auth/plugins' {
  export function admin(options?: any): any;
  export function apiKey(options?: any): any;
  export function multiSession(options?: any): any;
  export function openAPI(options?: any): any;
  export function oAuthProxy(options?: any): any;
  export function genericOAuth(options?: any): any;
  export function oidcProvider(options?: any): any;
}

declare module '@payload-auth/better-auth-plugin' {
  import { BetterAuthOptions } from 'better-auth';
  import { CollectionConfig } from 'payload';
  import { Payload } from 'payload';

  export interface PayloadBetterAuthPluginOptions {
    disabled?: boolean;
    logTables?: boolean;
    enableDebugLogs?: boolean;
    hidePluginCollections?: boolean;
    users?: {
      slug?: string;
      hidden?: boolean;
      adminRoles?: string[];
      roles?: string[];
      allowedFields?: string[];
      blockFirstBetterAuthVerificationEmail?: boolean;
      collectionOverrides?: (args: { collection: CollectionConfig }) => CollectionConfig;
    };
    accounts?: {
      slug?: string;
      hidden?: boolean;
    };
    sessions?: {
      slug?: string;
      hidden?: boolean;
    };
    verifications?: {
      slug?: string;
      hidden?: boolean;
    };
    betterAuthOptions: BetterAuthOptions;
  }

  export function getPayloadAuth<T = any>(config: Promise<any>): Promise<Payload<T>>;
}

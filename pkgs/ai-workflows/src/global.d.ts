/**
 * Global type declarations for ai-workflows
 */

interface DurableObject {
  storage: any;
}

declare global {
  var DURABLE_OBJECT: DurableObject;
}

export {};

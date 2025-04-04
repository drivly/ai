/**
 * Generated Action constants
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export const ACTION_NAMES = [
  "sendEmail",
  "createRecord",
  "updateRecord",
  "deleteRecord",
  "processData"
] as const

export type ActionName = typeof ACTION_NAMES[number]

/**
 * Generated Trigger constants
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export const TRIGGER_NAMES = ['webhookReceived', 'scheduleTriggered', 'eventOccurred', 'dataChanged', 'userAction'] as const

export type TriggerName = (typeof TRIGGER_NAMES)[number]

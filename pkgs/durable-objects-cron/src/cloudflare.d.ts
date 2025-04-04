
declare global {
  interface DurableObjectState {
    /**
     * Set an alarm to be triggered at the specified time
     */
    setAlarm(scheduledTime: number): Promise<void>;
    
    /**
     * Get the current alarm time
     */
    getAlarm(): Promise<number | null>;
  }
}

export {};

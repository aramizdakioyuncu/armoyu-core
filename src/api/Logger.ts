/**
 * Unified Logger Interface for ARMOYU SDK.
 * Allows developers to intercept and redirect library logs.
 */
export interface ArmoyuLogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug?(message: string, ...args: any[]): void;
}

/**
 * Default implementation of the ArmoyuLogger using the global console.
 */
export class ConsoleLogger implements ArmoyuLogger {
  private prefix: string;

  constructor(prefix: string = '[ARMOYU]') {
    this.prefix = prefix;
  }

  info(message: string, ...args: any[]): void {
    console.log(`${this.prefix} ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`${this.prefix} ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`${this.prefix} ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (console.debug) {
      console.debug(`${this.prefix} ${message}`, ...args);
    } else {
      console.log(`${this.prefix} [DEBUG] ${message}`, ...args);
    }
  }
}

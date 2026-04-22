import { ArmoyuApi } from '../../src/api/ArmoyuApi';
/**
 * Shared test helper to initialize the ArmoyuApi.
 */
export declare function createTestApi(): {
    api: ArmoyuApi;
    testUser: string;
    testPass: string;
};
/**
 * Helper to log success messages.
 */
export declare function logSuccess(message: string): void;
/**
 * Helper to log error messages.
 */
export declare function logError(message: string, error?: any): void;

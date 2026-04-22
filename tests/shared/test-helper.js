"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApi = createTestApi;
exports.logSuccess = logSuccess;
exports.logError = logError;
const ArmoyuApi_1 = require("../../src/api/ArmoyuApi");
/**
 * Shared test helper to initialize the ArmoyuApi.
 */
function createTestApi() {
    const apiKey = process.env.ARMOYU_API_KEY;
    const token = process.env.ARMOYU_TOKEN;
    if (!apiKey) {
        throw new Error('ARMOYU_API_KEY environment variable is not set.');
    }
    const api = new ArmoyuApi_1.ArmoyuApi(apiKey, {
        baseUrl: 'https://api.aramizdakioyuncu.com',
        token: token || null,
        usePreviousVersion: true
    });
    return {
        api,
        testUser: process.env.ARMOYU_TEST_USERNAME || 'deneme',
        testPass: process.env.ARMOYU_TEST_PASSWORD || 'deneme'
    };
}
/**
 * Helper to log success messages.
 */
function logSuccess(message) {
    console.log(`\x1b[32mSUCCESS: ${message}\x1b[0m`);
}
/**
 * Helper to log error messages.
 */
function logError(message, error) {
    console.error(`\x1b[31mERROR: ${message}\x1b[0m`, (error === null || error === void 0 ? void 0 : error.message) || error || '');
}

import { ARMOYUCore } from '../../src/api/ARMOYUCore';
import { ApiVersion } from '../../src/api/ApiClient';

/**
 * Initialize test clients for both OLD (V1) and CURRENT (V2) versions.
 */
export function createTestClients() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;

  if (!apiKey) {
    throw new Error('ARMOYU_API_KEY environment variable is not set.');
  }

  // OLD (V1) Client - Production API
  const apiOld = new ARMOYUCore(ApiVersion.OLD, apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token || null
  });

  // CURRENT (V2) Client - Local/Development API
  const apiCurrent = new ARMOYUCore(ApiVersion.CURRENT, process.env.ARMOYU_V2_API_KEY || '', {
    baseUrl: process.env.ARMOYU_TEST_BASE_URL || '',
    token: token || null,
    debugMode: true
  });

  return {
    apiOld,
    apiCurrent,
    testUser: process.env.ARMOYU_TEST_USERNAME || '',
    testPass: process.env.ARMOYU_TEST_PASSWORD || ''
  };
}

/**
 * Legacy helper for backward compatibility of other test files.
 */
export function createTestApi() {
  const { apiOld, testUser, testPass } = createTestClients();
  return {
    api: apiOld,
    testUser,
    testPass
  };
}

/**
 * Helper to log OLD (V1) related section titles.
 */
export function logOldSection(message: string) {
  console.log(`\x1b[36m\x1b[1m${message}\x1b[0m`); // Bold Cyan
}

/**
 * Helper to log CURRENT (V2) related section titles.
 */
export function logCurrentSection(message: string) {
  console.log(`\x1b[33m\x1b[1m${message}\x1b[0m`); // Bold Yellow
}

/**
 * Helper to log success messages.
 */
export function logSuccess(message: string) {
  console.log(`\x1b[32mSUCCESS: ${message}\x1b[0m`);
}

/**
 * Helper to log error messages.
 */
export function logError(message: string, error?: any) {
  console.error(`\x1b[31mERROR: ${message}\x1b[0m`, error?.message || error || '');
}

/**
 * OLD (V1) success — Cyan, matching section header colour.
 */
export function logOldSuccess(message: string) {
  console.log(`\x1b[36mSUCCESS [OLD]: ${message}\x1b[0m`);
}

/**
 * OLD (V1) error — Cyan label, red message.
 */
export function logOldError(message: string, error?: any) {
  console.error(`\x1b[36mERROR   [OLD]:\x1b[0m \x1b[31m${message}\x1b[0m`, error?.message || error || '');
}

/**
 * CURRENT (V2) success — Yellow, matching section header colour.
 */
export function logCurrentSuccess(message: string) {
  console.log(`\x1b[33mSUCCESS [CURRENT]: ${message}\x1b[0m`);
}

/**
 * CURRENT (V2) error — Yellow label, red message.
 */
export function logCurrentError(message: string, error?: any) {
  console.error(`\x1b[33mERROR   [CURRENT]:\x1b[0m \x1b[31m${message}\x1b[0m`, error?.message || error || '');
}

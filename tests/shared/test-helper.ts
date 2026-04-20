import { ArmoyuApi } from '../../src/api/ArmoyuApi';

/**
 * Shared test helper to initialize the ArmoyuApi.
 */
export function createTestApi() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;

  if (!apiKey) {
    throw new Error('ARMOYU_API_KEY environment variable is not set.');
  }

  const api = new ArmoyuApi(apiKey, {
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
export function logSuccess(message: string) {
  console.log(`\x1b[32mSUCCESS: ${message}\x1b[0m`);
}

/**
 * Helper to log error messages.
 */
export function logError(message: string, error?: any) {
  console.error(`\x1b[31mERROR: ${message}\x1b[0m`, error?.message || error || '');
}

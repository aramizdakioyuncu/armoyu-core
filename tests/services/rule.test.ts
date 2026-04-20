import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runRuleTest() {
  console.log('--- Rule Service Test ---');
  const { api } = createTestApi();

  try {
    const rulesResponse = await api.rules.getRules(1);
    logSuccess(`Rules list fetched! Count: ${rulesResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Rules fetch failed', err);
  }
}

runRuleTest();

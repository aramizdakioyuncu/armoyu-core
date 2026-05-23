import { createTestClients, logSuccess, logError, logOldSection, logCurrentSection } from '../shared/test-helper';

async function runLoginTest() {
  console.log('--- Auth Login Test (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // 1. OLD API version test (Production endpoint)
  console.log();
  logOldSection('[OLD API Test]');
  try {
    const loginResult = await apiOld.auth.login(testUser, testPass);
    logSuccess(`OLD Login completed: ${JSON.stringify(loginResult.icerik)}`);
  } catch (err: any) {
    logError('OLD Login failed', err);
  }

  // 2. CURRENT API version test (Local/Development endpoint)
  console.log();
  logCurrentSection('[CURRENT API Test]');
  try {
    const loginResult = await apiCurrent.auth.login(testUser, testPass);
    logSuccess(`CURRENT Login completed: ${JSON.stringify(loginResult.icerik)}`);
  } catch (err: any) {
    logError('CURRENT Login failed', err);
  }
}

runLoginTest();

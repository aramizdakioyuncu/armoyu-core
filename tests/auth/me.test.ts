import { createTestClients, logSuccess, logError, logCurrentSection } from '../shared/test-helper';

async function runMeTest() {
  console.log('--- Auth me() Profile Test ---');
  const { apiCurrent, testUser, testPass } = createTestClients();

  logCurrentSection('[CURRENT API me() Test]');
  try {
    // We must login first to set the token on the client
    const loginResult = await apiCurrent.auth.login(testUser, testPass);
    if (loginResult.durum === 1) {
      const meResult = await apiCurrent.auth.me();
      if (meResult.durum === 1) {
        logSuccess(`CURRENT me() completed for: ${meResult.icerik?.username}`);
        console.log("CURRENT User details:", JSON.stringify(meResult.icerik));
      } else {
        logError(`CURRENT me() failed: ${meResult.aciklama}`);
      }
    } else {
      logError('Login failed, cannot test me()');
    }
  } catch (err: any) {
    logError('CURRENT me() test failed', err);
  }
}

runMeTest();

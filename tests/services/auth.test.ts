import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runAuthTest() {
  console.log('--- AuthService Test ---');
  const { api, testUser, testPass } = createTestApi();

  try {
    const loginResult = await api.auth.login(testUser, testPass);
    logSuccess(`Login completed for user: ${loginResult.icerik?.user.username}`);
  } catch (err: any) {
    logError('Login failed', err);
  }
}

runAuthTest();

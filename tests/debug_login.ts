import { ArmoyuApi } from '../src/api/ArmoyuApi';

async function test() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const testUser = process.env.ARMOYU_TEST_USERNAME || 'deneme';
  const testPass = process.env.ARMOYU_TEST_PASSWORD || 'deneme';

  const api = new ArmoyuApi(apiKey!, {
    baseUrl: `https://api.aramizdakioyuncu.com`,
  });

  try {
      console.log('--- ATTEMPTING LOGIN VIA SERVICE ---');
      const loginResult = await api.auth.login(testUser, testPass);
      console.log('--- LOGIN SUCCESSFUL ---');
      console.log('User Role:', loginResult.user.username);
      console.log('Has Session:', !!loginResult.session);
  } catch (err) {
      console.error('--- LOGIN FAILED ---');
      console.error(err instanceof Error ? err.message : err);
  }
}
test();

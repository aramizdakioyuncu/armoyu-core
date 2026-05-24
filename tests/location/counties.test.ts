import {
  createTestClients,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const PROVINCE_ID = Number(process.env.ARMOYU_TEST_PROVINCE_ID || '1');

async function runCountiesTest() {
  console.log(`--- Location Service: Counties (provinceId: ${PROVINCE_ID}) (CURRENT only) ---`);
  const { apiCurrent, testUser, testPass } = createTestClients();

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getCounties');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.locations.getCounties(1, PROVINCE_ID, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Counties fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[33m  #${c.id} ${c.name}\x1b[0m`)
      );
    } else {
      logCurrentError('getCounties returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getCounties failed', err);
  }
}

runCountiesTest();

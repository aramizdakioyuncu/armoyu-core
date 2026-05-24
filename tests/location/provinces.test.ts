import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const COUNTRY_ID = Number(process.env.ARMOYU_TEST_COUNTRY_ID || '212');

async function runProvincesTest() {
  console.log(`--- Location Service: Provinces (countryId: ${COUNTRY_ID}) (OLD & CURRENT) ---`);
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getProvinces');
  try {
    const result = await apiOld.locations.getProvinces(1, COUNTRY_ID, 10);
    if (result.durum === 1) {
      logOldSuccess(`Provinces fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(p =>
        console.log(`\x1b[36m  #${p.id} ${p.name} (plate: ${p.plateCode})\x1b[0m`)
      );
    } else {
      logOldError('getProvinces returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getProvinces failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getProvinces');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.locations.getProvinces(1, COUNTRY_ID, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Provinces fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(p =>
        console.log(`\x1b[33m  #${p.id} ${p.name} (plate: ${p.plateCode})\x1b[0m`)
      );
    } else {
      logCurrentError('getProvinces returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getProvinces failed', err);
  }
}

runProvincesTest();

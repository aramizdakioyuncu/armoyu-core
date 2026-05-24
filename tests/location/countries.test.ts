import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

async function runCountriesTest() {
  console.log('--- Location Service: Countries (OLD & CURRENT) ---');
  const { apiOld, apiCurrent } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getCountries');
  try {
    const result = await apiOld.locations.getCountries(1, 10);
    if (result.durum === 1) {
      logOldSuccess(`Countries fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[36m  #${c.id} ${c.name} (${c.code})\x1b[0m`)
      );
    } else {
      logOldError('getCountries returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getCountries failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getCountries');
  try {
    const result = await apiCurrent.locations.getCountries(1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Countries fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[33m  #${c.id} ${c.name} (${c.code})\x1b[0m`)
      );
    } else {
      logCurrentError('getCountries returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getCountries failed', err);
  }
}

runCountriesTest();

import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runSchoolsTest() {
  console.log('--- Education Service: Schools (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getSchools');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.education.getSchools();
    if (result.durum === 1) {
      logOldSuccess(`Schools fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(s =>
        console.log(`\x1b[36m  #${s.id} ${s.name}\x1b[0m`)
      );
    } else {
      logOldError('getSchools returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getSchools failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getSchools');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.education.getSchools();
    if (result.durum === 1) {
      logCurrentSuccess(`Schools fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(s =>
        console.log(`\x1b[33m  #${s.id} ${s.name}\x1b[0m`)
      );
    } else {
      logCurrentError('getSchools returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getSchools failed', err);
  }
}

runSchoolsTest();

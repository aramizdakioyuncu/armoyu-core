import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const SCHOOL_ID = Number(process.env.ARMOYU_TEST_SCHOOL_ID || '1');

async function runClassroomsTest() {
  console.log('--- Education Service: Classrooms (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getClassrooms');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.education.getClassrooms(SCHOOL_ID, 1, 10);
    if (result.durum === 1) {
      logOldSuccess(`Classrooms fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[36m  #${c.id} ${c.name} (${c.type})\x1b[0m`)
      );
    } else {
      logOldError('getClassrooms returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getClassrooms failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getClassrooms');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.education.getClassrooms(SCHOOL_ID, 1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Classrooms fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[33m  #${c.id} ${c.name} (${c.type})\x1b[0m`)
      );
    } else {
      logCurrentError('getClassrooms returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getClassrooms failed', err);
  }
}

runClassroomsTest();

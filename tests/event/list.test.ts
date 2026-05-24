import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runEventListTest() {
  console.log('--- Event Service: List Events (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getEvents');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.events.getEvents(1, { limit: 5 });
    if (result.durum === 1) {
      logOldSuccess(`Events fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(e =>
        console.log(`\x1b[36m  #${e.id} ${e.name} — ${e.gameName} (${e.date})\x1b[0m`)
      );
    } else {
      logOldError('getEvents returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getEvents failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getEvents');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.events.getEvents(1, { limit: 5 });
    if (result.durum === 1) {
      logCurrentSuccess(`Events fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(e =>
        console.log(`\x1b[33m  #${e.id} ${e.name} — ${e.gameName} (${e.date})\x1b[0m`)
      );
    } else {
      logCurrentError('getEvents returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getEvents failed', err);
  }
}

runEventListTest();

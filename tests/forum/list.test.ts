import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runForumListTest() {
  console.log('--- Forum Service: List Topics (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getTopics');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.forum.getTopics(1, { limit: 5 });
    if (result.durum === 1) {
      logOldSuccess(`Topics fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(t =>
        console.log(`\x1b[36m  [${t.type}] #${t.id} ${t.title} — ${t.creatorName}\x1b[0m`)
      );
    } else {
      logOldError('getTopics returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getTopics failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getTopics');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.forum.getTopics(1, { limit: 5 });
    if (result.durum === 1) {
      logCurrentSuccess(`Topics fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(t =>
        console.log(`\x1b[33m  [${t.type}] #${t.id} ${t.title} — ${t.creatorName}\x1b[0m`)
      );
    } else {
      logCurrentError('getTopics returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getTopics failed', err);
  }
}

runForumListTest();

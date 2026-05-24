import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const QUERY = process.env.ARMOYU_TEST_SEARCH_QUERY || 'ber';

async function runSearchTest() {
  console.log('--- Search Service (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) globalSearch ---
  console.log();
  logOldSection('[OLD API Test] globalSearch');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.search.globalSearch(QUERY, 1, 10);
    if (result.durum === 1) {
      logOldSuccess(`Results: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(r =>
        console.log(`\x1b[36m  #${r.id} [${r.type}] — ${r.title}\x1b[0m`)
      );
    } else {
      logOldError('globalSearch returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD globalSearch failed', err);
  }

  // --- CURRENT (V2) search ---
  console.log();
  logCurrentSection('[CURRENT API Test] search');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.search.search(QUERY, 1, { filter: 'user', limit: 10 });
    if (result.durum === 1) {
      logCurrentSuccess(`Results: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(r =>
        console.log(`\x1b[33m  #${r.id} [${r.type}] — ${r.title}\x1b[0m`)
      );
    } else {
      logCurrentError('search returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT search failed', err);
  }
}

runSearchTest();

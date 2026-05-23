import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runBlogListTest() {
  console.log('--- Blog Service: News List (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getNews');
  try {
    const result = await apiOld.blog.getNews(1);
    if (result.durum === 1) {
      logOldSuccess(`News fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(n =>
        console.log(`\x1b[36m  - [${n.id}] ${n.title} (${n.category}) — ${n.date}\x1b[0m`)
      );
    } else {
      logOldError('getNews returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getNews failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getNews');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.blog.getNews(1, 5);
    if (result.durum === 1) {
      logCurrentSuccess(`News fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(n =>
        console.log(`\x1b[33m  - [${n.id}] ${n.title} (${n.category}) — ${n.date}\x1b[0m`)
      );
    } else {
      logCurrentError('getNews returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getNews failed', err);
  }
}

runBlogListTest();

import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const TOPIC_URL = process.env.ARMOYU_TEST_FORUM_TOPIC_URL || 'tlauncher-opengl-sorunu1646432460';

async function runForumDetailTest() {
  console.log('--- Forum Service: Topic Detail (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getTopicDetail');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.forum.getTopicDetail(TOPIC_URL);
    if (result.durum === 1 && result.icerik) {
      logOldSuccess(`Topic found! #${result.icerik.id} "${result.icerik.title}"`);
      console.log(`\x1b[36m  Category: ${result.icerik.category?.name} | Creator: ${result.icerik.creatorName}\x1b[0m`);
    } else {
      logOldError('getTopicDetail returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getTopicDetail failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getTopicDetail');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.forum.getTopicDetail(TOPIC_URL);
    if (result.durum === 1 && result.icerik) {
      logCurrentSuccess(`Topic found! #${result.icerik.id} "${result.icerik.title}"`);
      console.log(`\x1b[33m  Category: ${result.icerik.category?.name} | Creator: ${result.icerik.creatorName}\x1b[0m`);
      console.log(`\x1b[33m  Date: ${result.icerik.date} | Status: ${result.icerik.status}\x1b[0m`);
    } else {
      logCurrentError('getTopicDetail returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getTopicDetail failed', err);
  }
}

runForumDetailTest();

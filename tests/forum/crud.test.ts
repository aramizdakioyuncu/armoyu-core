import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const DELETE_TOPIC_ID = Number(process.env.ARMOYU_TEST_FORUM_DELETE_ID || '23');

async function runForumCrudTest() {
  console.log('--- Forum Service: Create & Delete Topic (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] createTopic');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.forum.createTopic({
      title: 'Test Konusu (V1)',
      type: 'soru',
      categoryId: 1,
      content: 'Bu bir test konusudur.'
    });
    if (result.durum === 1) {
      logOldSuccess(`Topic created! #${result.icerik?.id} "${result.icerik?.title}"`);
    } else {
      logOldError('createTopic returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD createTopic failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] createTopic');
  let createdId: number | null = null;
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.forum.createTopic({
      title: 'Test Konusu (V2)',
      type: 'soru',
      categoryId: 1,
      content: 'Bu bir test konusudur.'
    });
    if (result.durum === 1 && result.icerik) {
      createdId = result.icerik.id;
      logCurrentSuccess(`Topic created! #${result.icerik.id} "${result.icerik.title}"`);
      console.log(`\x1b[33m  Category: ${result.icerik.category?.name} | URL: ${result.icerik.url}\x1b[0m`);
    } else {
      logCurrentError('createTopic returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createTopic failed', err);
  }

  // --- CURRENT (V2) deleteTopic (created topic) ---
  if (createdId !== null) {
    console.log();
    logCurrentSection('[CURRENT API Test] deleteTopic (created topic)');
    try {
      const result = await apiCurrent.forum.deleteTopic(createdId);
      if (result.durum === 1) {
        logCurrentSuccess(`Topic #${createdId} deleted!`);
      } else {
        logCurrentError('deleteTopic returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deleteTopic failed', err);
    }
  }

  // --- CURRENT (V2) deleteTopic (standalone ID) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] deleteTopic (ID: ${DELETE_TOPIC_ID})`);
  try {
    const result = await apiCurrent.forum.deleteTopic(DELETE_TOPIC_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Topic #${DELETE_TOPIC_ID} deleted!`);
    } else {
      logCurrentError(`deleteTopic #${DELETE_TOPIC_ID}: ${result.aciklama}`);
    }
  } catch (err: any) {
    logCurrentError('CURRENT deleteTopic (standalone) failed', err);
  }
}

runForumCrudTest();

import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const TARGET_USER_ID = Number(process.env.ARMOYU_TEST_TARGET_USER_ID || '1');

async function runChatHistoryTest() {
  console.log('--- Chat Service: History (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getChatHistory');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.chat.getChatHistory(1, { userId: TARGET_USER_ID, limit: 10 });
    if (result.durum === 1) {
      logOldSuccess(`Chat history fetched! Message count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(m =>
        console.log(`\x1b[36m  [${m.side}] ${m.authorName}: ${m.content} (${m.timeLabel})\x1b[0m`)
      );
    } else {
      logOldError('getChatHistory returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getChatHistory failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getChatHistory');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.chat.getChatHistory(1, { userId: TARGET_USER_ID, limit: 10 });
    if (result.durum === 1) {
      logCurrentSuccess(`Chat history fetched! Message count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(m =>
        console.log(`\x1b[33m  [${m.side}] ${m.authorName}: ${m.content} (${m.timeLabel})\x1b[0m`)
      );
    } else {
      logCurrentError('getChatHistory returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getChatHistory failed', err);
  }
}

runChatHistoryTest();

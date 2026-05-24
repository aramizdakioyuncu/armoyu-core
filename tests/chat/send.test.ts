import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';
import { ChatType } from '../../src/models';

const TARGET_USER_ID = Number(process.env.ARMOYU_TEST_TARGET_USER_ID || '20');
const TEST_MESSAGE = process.env.ARMOYU_TEST_CHAT_MESSAGE || 'test mesajı (armoyu-core)';

async function runSendMessageTest() {
  console.log('--- Chat Service: Send Message (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] sendMessage');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.chat.sendMessage(TARGET_USER_ID, TEST_MESSAGE, ChatType.PRIVATE);
    if (result.durum === 1) {
      logOldSuccess(`Message sent! Response: ${result.aciklama}`);
    } else {
      logOldError('sendMessage returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD sendMessage failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] sendMessage');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.chat.sendMessage(TARGET_USER_ID, TEST_MESSAGE, ChatType.PRIVATE);
    if (result.durum === 1) {
      logCurrentSuccess(`Message sent! Response: ${result.aciklama}`);
    } else {
      logCurrentError('sendMessage returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT sendMessage failed', err);
  }
}

runSendMessageTest();

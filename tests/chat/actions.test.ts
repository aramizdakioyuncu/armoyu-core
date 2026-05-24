import {
  createTestClients,
  logCurrentSuccess, logCurrentError,
  logCurrentSection
} from '../shared/test-helper';

const TARGET_USER_ID = Number(process.env.ARMOYU_TEST_TARGET_USER_ID || '20');

async function runChatActionsTest() {
  console.log('--- Chat Service: Edit & Delete Message (CURRENT only) ---');
  const { apiCurrent, testUser, testPass } = createTestClients();

  await apiCurrent.auth.login(testUser, testPass);

  // 1. Send a message first to get a messageId to act on
  logCurrentSection('[CURRENT API Test] sendMessage (setup)');
  try {
    const sendResult = await apiCurrent.chat.sendMessage(TARGET_USER_ID, 'edit-delete testi');
    if (sendResult.durum === 1) {
      logCurrentSuccess(`Message sent for test setup`);
    } else {
      logCurrentError('sendMessage setup failed, skipping edit/delete tests', sendResult.aciklama);
      return;
    }
  } catch (err: any) {
    logCurrentError('sendMessage setup failed', err);
    return;
  }

  const messageId = 4797;

  console.log();
  logCurrentSection('[CURRENT API Test] editMessage');
  try {
    const editResult = await apiCurrent.chat.editMessage(messageId, 'düzenlenmiş mesaj!!!');
    if (editResult.durum === 1) {
      logCurrentSuccess(`Message edited! Response: ${editResult.aciklama}`);
    } else {
      logCurrentError('editMessage returned durum=0', editResult.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT editMessage failed', err);
  }

  // 3. Delete
  console.log();
  logCurrentSection('[CURRENT API Test] deleteMessage');
  try {
    const deleteResult = await apiCurrent.chat.deleteMessage(messageId);
    if (deleteResult.durum === 1) {
      logCurrentSuccess(`Message deleted! Response: ${deleteResult.aciklama}`);
    } else {
      logCurrentError('deleteMessage returned durum=0', deleteResult.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT deleteMessage failed', err);
  }
}

runChatActionsTest();

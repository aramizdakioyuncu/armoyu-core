import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runChatInboxTest() {
  console.log('--- Chat Service: Inbox & Friends (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1): getChats ---
  console.log();
  logOldSection('[OLD API Test] getChats (inbox)');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.chat.getChats(1, { limit: 10 });
    if (result.durum === 1) {
      logOldSuccess(`Inbox fetched! Conversation count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[36m  [${c.type}] ${c.displayName}: "${c.lastMessage}"\x1b[0m`)
      );
    } else {
      logOldError('getChats returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getChats failed', err);
  }

  // --- OLD (V1): getFriendsChat ---
  console.log();
  logOldSection('[OLD API Test] getFriendsChat');
  try {
    const result = await apiOld.chat.getFriendsChat(1, { limit: 5 });
    if (result.durum === 1) {
      logOldSuccess(`Friends chat list fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[36m  ${c.displayName} (@${c.username})\x1b[0m`)
      );
    } else {
      logOldError('getFriendsChat returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getFriendsChat failed', err);
  }

  // --- CURRENT (V2): getChats ---
  console.log();
  logCurrentSection('[CURRENT API Test] getChats (inbox)');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.chat.getChats(1, { limit: 10 });
    if (result.durum === 1) {
      logCurrentSuccess(`Inbox fetched! Conversation count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[33m  [${c.type}] ${c.displayName}: "${c.lastMessage}"\x1b[0m`)
      );
    } else {
      logCurrentError('getChats returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getChats failed', err);
  }

  // --- CURRENT (V2): getFriendsChat ---
  console.log();
  logCurrentSection('[CURRENT API Test] getFriendsChat');
  try {
    const result = await apiCurrent.chat.getFriendsChat(1, { limit: 5 });
    if (result.durum === 1) {
      logCurrentSuccess(`Friends chat list fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(c =>
        console.log(`\x1b[33m  ${c.displayName} (@${c.username})\x1b[0m`)
      );
    } else {
      logCurrentError('getFriendsChat returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getFriendsChat failed', err);
  }
}

runChatInboxTest();

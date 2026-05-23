import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runBlockListTest() {
  console.log('--- Block Service: Blocked Users List (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getBlockedUsers');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.blocks.getBlockedUsers(1);
    if (result.durum === 1) {
      logOldSuccess(`Blocked users fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(u =>
        console.log(`\x1b[36m  - [${u.userId}] ${u.username} (blocked: ${u.blockDate})\x1b[0m`)
      );
    } else {
      logOldError('getBlockedUsers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getBlockedUsers failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getBlockedUsers');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.blocks.getBlockedUsers(1);
    if (result.durum === 1) {
      logCurrentSuccess(`Blocked users fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(u =>
        console.log(`\x1b[33m  - [${u.userId}] ${u.username} | ${u.displayName} (blocked: ${u.blockDate})\x1b[0m`)
      );
    } else {
      logCurrentError('getBlockedUsers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getBlockedUsers failed', err);
  }
}

runBlockListTest();

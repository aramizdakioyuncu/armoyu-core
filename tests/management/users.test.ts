import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

async function runManagementUsersTest() {
  console.log('--- Management Service: Users (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getUsers');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.management.getUsers();
    if (result.durum === 1) {
      logOldSuccess(`Users fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(u =>
        console.log(`\x1b[36m  #${u.userNumber} ${u.displayName} (${u.username}) — role: ${u.role} | rights: ${u.remainingRights} | problem: ${u.isProblem}\x1b[0m`)
      );
    } else {
      logOldError('getUsers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getUsers failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getUsers');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.management.getUsers();
    if (result.durum === 1) {
      logCurrentSuccess(`Users fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(u =>
        console.log(`\x1b[33m  #${u.userNumber} ${u.displayName} (${u.username}) — role: ${u.role} | rights: ${u.remainingRights} | problem: ${u.isProblem}\x1b[0m`)
      );
    } else {
      logCurrentError('getUsers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getUsers failed', err);
  }
}

runManagementUsersTest();

import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runGroupListTest() {
  console.log('--- Group Service: List Groups (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getGroups');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.groups.getGroups(1, { limit: 5 });
    if (result.durum === 1) {
      logOldSuccess(`Groups fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(g =>
        console.log(`\x1b[36m  #${g.id} ${g.name} [${g.tag}] — ${g.memberCount} üye\x1b[0m`)
      );
    } else {
      logOldError('getGroups returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getGroups failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getGroups');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.groups.getGroups(1, { limit: 5 });
    if (result.durum === 1) {
      logCurrentSuccess(`Groups fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(g =>
        console.log(`\x1b[33m  #${g.id} ${g.name} [${g.tag}] — ${g.memberCount} üye | Kurucu: ${g.founder}\x1b[0m`)
      );
    } else {
      logCurrentError('getGroups returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getGroups failed', err);
  }
}

runGroupListTest();

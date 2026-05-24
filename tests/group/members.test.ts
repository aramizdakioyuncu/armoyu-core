import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const GROUP_ID = Number(process.env.ARMOYU_TEST_GROUP_ID || '116');
const GROUP_URL = process.env.ARMOYU_TEST_GROUP_URL || 'rihtim';
const INVITE_USER_ID = Number(process.env.ARMOYU_TEST_INVITE_USER_ID || '11107');

async function runGroupMembersTest() {
  console.log('--- Group Member Service: Members (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getMembers ---
  console.log();
  logOldSection('[OLD API Test] getMembers');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.groups.member.getMembers({ groupUrl: GROUP_URL }, 1, { limit: 5 });
    if (result.durum === 1) {
      logOldSuccess(`Members fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(m =>
        console.log(`\x1b[36m  #${m.id} ${m.displayName} (${m.username}) — ${m.role}\x1b[0m`)
      );
    } else {
      logOldError('getMembers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getMembers failed', err);
  }

  // --- CURRENT (V2) getMembers ---
  console.log();
  logCurrentSection('[CURRENT API Test] getMembers');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.groups.member.getMembers({ groupId: GROUP_ID }, 1, { limit: 5 });
    if (result.durum === 1) {
      logCurrentSuccess(`Members fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(m =>
        console.log(`\x1b[33m  #${m.id} ${m.displayName} (${m.username}) — ${m.role}\x1b[0m`)
      );
    } else {
      logCurrentError('getMembers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getMembers failed', err);
  }

  // --- CURRENT (V2) invite ---
  console.log();
  logCurrentSection(`[CURRENT API Test] invite (userId: ${INVITE_USER_ID})`);
  try {
    const result = await apiCurrent.groups.member.invite(GROUP_ID, INVITE_USER_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`User ${INVITE_USER_ID} invited to group ${GROUP_ID}!`);
    } else {
      logCurrentError(`invite returned durum=0: ${result.aciklama}`);
    }
  } catch (err: any) {
    logCurrentError('CURRENT invite failed', err);
  }
}

runGroupMembersTest();

import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

async function runManagementMeetingsTest() {
  console.log('--- Management Service: Meetings (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] getMeetings');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.management.getMeetings();
    if (result.durum === 1) {
      logOldSuccess(`Meetings fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(m =>
        console.log(`\x1b[36m  #${m.id} "${m.name}" by ${m.creatorName} — ${m.date} | participants: ${m.participantCount}/${m.participantLimit} | ${m.status}\x1b[0m`)
      );
    } else {
      logOldError('getMeetings returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getMeetings failed', err);
  }

  // --- CURRENT (V2) ---
  console.log();
  logCurrentSection('[CURRENT API Test] getMeetings');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.management.getMeetings();
    if (result.durum === 1) {
      logCurrentSuccess(`Meetings fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(m =>
        console.log(`\x1b[33m  #${m.id} "${m.name}" by ${m.creatorName} — ${m.date} | participants: ${m.participantCount}/${m.participantLimit} | ${m.status}\x1b[0m`)
      );
    } else {
      logCurrentError('getMeetings returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getMeetings failed', err);
  }
}

runManagementMeetingsTest();

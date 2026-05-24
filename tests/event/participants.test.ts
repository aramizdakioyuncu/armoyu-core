import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const EVENT_ID_TEAMS = Number(process.env.ARMOYU_TEST_EVENT_TEAMS_ID || '327');
const EVENT_ID_PARTICIPANTS = Number(process.env.ARMOYU_TEST_EVENT_PARTICIPANTS_ID || '345');

async function runEventParticipantsTest() {
  console.log('--- Event Service: Teams & Participants (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getEventTeams ---
  console.log();
  logOldSection('[OLD API Test] getEventTeams');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.events.getEventTeams(EVENT_ID_TEAMS);
    if (result.durum === 1) {
      logOldSuccess(`Teams fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach((t: any) =>
        console.log(`\x1b[36m  ${t.name || t.grup_adi} (${t.players?.length ?? t.katilimcilar?.length} players)\x1b[0m`)
      );
    } else {
      logOldError('getEventTeams returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getEventTeams failed', err);
  }

  // --- CURRENT (V2) getEventTeams ---
  console.log();
  logCurrentSection('[CURRENT API Test] getEventTeams');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.events.getEventTeams(EVENT_ID_TEAMS);
    if (result.durum === 1) {
      logCurrentSuccess(`Teams fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach((t: any) =>
        console.log(`\x1b[33m  ${t.name} — ${t.shortName} (${t.players?.length} players)\x1b[0m`)
      );
    } else {
      logCurrentError('getEventTeams returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getEventTeams failed', err);
  }

  // --- OLD (V1) getEventParticipants ---
  console.log();
  logOldSection('[OLD API Test] getEventParticipants');
  try {
    const result = await apiOld.events.getEventParticipants(EVENT_ID_PARTICIPANTS);
    if (result.durum === 1) {
      const p = result.icerik;
      logOldSuccess(`Participants fetched! Groups: ${p?.groups?.length} | Individuals: ${p?.individuals?.length}`);
    } else {
      logOldError('getEventParticipants returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getEventParticipants failed', err);
  }

  // --- CURRENT (V2) getEventParticipants ---
  console.log();
  logCurrentSection('[CURRENT API Test] getEventParticipants');
  try {
    const result = await apiCurrent.events.getEventParticipants(EVENT_ID_PARTICIPANTS);
    if (result.durum === 1) {
      const p = result.icerik;
      logCurrentSuccess(`Participants fetched! Individuals: ${p?.individuals?.length}`);
      p?.individuals?.slice(0, 3).forEach(i =>
        console.log(`\x1b[33m  #${i.id} ${i.name} (${i.username})\x1b[0m`)
      );
    } else {
      logCurrentError('getEventParticipants returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getEventParticipants failed', err);
  }
}

runEventParticipantsTest();

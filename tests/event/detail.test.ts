import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const EVENT_ID = Number(process.env.ARMOYU_TEST_EVENT_ID || '346');
const EVENT_URL = process.env.ARMOYU_TEST_EVENT_URL || 'okey-etkinligi1716995531';

async function runEventDetailTest() {
  console.log('--- Event Service: Event Detail (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) by ID ---
  console.log();
  logOldSection('[OLD API Test] getEventDetail (by ID)');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.events.getEventDetail({ eventId: EVENT_ID });
    if (result.durum === 1 && result.icerik) {
      logOldSuccess(`Event found! #${result.icerik.id} "${result.icerik.name}"`);
      console.log(`\x1b[36m  Game: ${result.icerik.gameName} | Date: ${result.icerik.date} | Participants: ${result.icerik.participantCount}/${result.icerik.participantLimit}\x1b[0m`);
    } else {
      logOldError('getEventDetail returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getEventDetail failed', err);
  }

  // --- CURRENT (V2) by ID ---
  console.log();
  logCurrentSection('[CURRENT API Test] getEventDetail (by ID)');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.events.getEventDetail({ eventId: EVENT_ID });
    if (result.durum === 1 && result.icerik) {
      logCurrentSuccess(`Event found! #${result.icerik.id} "${result.icerik.name}"`);
      console.log(`\x1b[33m  Game: ${result.icerik.gameName} | Date: ${result.icerik.date} | Participants: ${result.icerik.participantCount}/${result.icerik.participantLimit}\x1b[0m`);
    } else {
      logCurrentError('getEventDetail returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getEventDetail by ID failed', err);
  }

  // --- CURRENT (V2) by URL ---
  console.log();
  logCurrentSection('[CURRENT API Test] getEventDetail (by URL)');
  try {
    const result = await apiCurrent.events.getEventDetail({ eventUrl: EVENT_URL });
    if (result.durum === 1 && result.icerik) {
      logCurrentSuccess(`Event found by URL! #${result.icerik.id} "${result.icerik.name}"`);
      console.log(`\x1b[33m  Organizers: ${result.icerik.organizers?.map(o => o.displayName).join(', ')}\x1b[0m`);
    } else {
      logCurrentError('getEventDetail by URL returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getEventDetail by URL failed', err);
  }
}

runEventDetailTest();

import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const PLAYER_ID = Number(process.env.ARMOYU_TEST_PLAYER_ID || '1');
const MEDIA_ID = Number(process.env.ARMOYU_TEST_MEDIA_ID || '7683');

async function runMediaGalleryTest() {
  console.log('--- Media Service: Gallery (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getGallery ---
  console.log();
  logOldSection('[OLD API Test] getGallery');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.media.getGallery(1);
    if (result.durum === 1) {
      logOldSuccess(`Gallery fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(m =>
        console.log(`\x1b[36m  #${m.id} [${m.category}] ${m.type} — ${m.size} | ${m.time}\x1b[0m`)
      );
    } else {
      logOldError('getGallery returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getGallery failed', err);
  }

  // --- CURRENT (V2) getGallery ---
  console.log();
  logCurrentSection('[CURRENT API Test] getGallery');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.media.getGallery(1, undefined, PLAYER_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Gallery fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(m =>
        console.log(`\x1b[33m  #${m.id} [${m.category}] ${m.type} — ${m.size} | owner: ${m.owner.username}\x1b[0m`)
      );
    } else {
      logCurrentError('getGallery returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getGallery failed', err);
  }

  // --- CURRENT (V2) getMediaDetail ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getMediaDetail (mediaId: ${MEDIA_ID})`);
  try {
    const result = await apiCurrent.media.getMediaDetail(MEDIA_ID);
    if (result.durum === 1) {
      const m = result.icerik!;
      logCurrentSuccess(`Media detail fetched! #${m.id} [${m.category}] ${m.type}`);
      console.log(`\x1b[33m  URL: ${m.url.large}\x1b[0m`);
    } else {
      logCurrentError('getMediaDetail returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getMediaDetail failed', err);
  }
}

runMediaGalleryTest();

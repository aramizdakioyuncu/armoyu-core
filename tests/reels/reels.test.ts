import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

// Set ARMOYU_TEST_REEL_MEDIA_ID etc. in .env to use a real media asset
const TEST_MEDIA_ID = Number(process.env.ARMOYU_TEST_REEL_MEDIA_ID || '7579');
const TEST_MEDIA_HIGH = process.env.ARMOYU_TEST_REEL_MEDIA_HIGH || 'https://storage.aramizdakioyuncu.com/galeri/images/1orijinal17480680172.jpg';
const TEST_MEDIA_NORM = process.env.ARMOYU_TEST_REEL_MEDIA_NORM || 'https://storage.aramizdakioyuncu.com/galeri/images/1ufaklik17480680172.jpg';
const TEST_MEDIA_MIN  = process.env.ARMOYU_TEST_REEL_MEDIA_MIN  || 'https://storage.aramizdakioyuncu.com/galeri/images/1minnak17480680172.jpg';

async function runReelsTest() {
  console.log('--- Reels Service (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getReels ---
  console.log();
  logOldSection('[OLD API Test] getReels');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.reels.getReels(1, 5);
    if (result.durum === 1) {
      logOldSuccess(`Reels fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(r =>
        console.log(`\x1b[36m  #${r.id} by ${r.owner.displayName} — likes: ${r.likeCount} | comments: ${r.commentCount}\x1b[0m`)
      );
    } else {
      logOldError('getReels returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getReels failed', err);
  }

  // --- CURRENT (V2) getReels ---
  console.log();
  logCurrentSection('[CURRENT API Test] getReels');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.reels.getReels(1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Reels fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(r =>
        console.log(`\x1b[33m  #${r.id} "${r.description}" by ${r.owner.displayName} (@${r.owner.username}) | likes: ${r.likeCount}\x1b[0m`)
      );
    } else {
      logCurrentError('getReels returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getReels failed', err);
  }

  // --- CURRENT (V2) createReel ---
  console.log();
  logCurrentSection('[CURRENT API Test] createReel');
  let createdReelId: number | undefined;
  try {
    const result = await apiCurrent.reels.createReel({
      description: '[test] otomatik oluşturuldu',
      mediaId: TEST_MEDIA_ID,
      mediaHigh: TEST_MEDIA_HIGH,
      mediaNorm: TEST_MEDIA_NORM,
      mediaMin: TEST_MEDIA_MIN
    });
    if (result.durum === 1) {
      createdReelId = result.icerik?.id;
      logCurrentSuccess(`Reel created! id: ${createdReelId} | desc: "${result.icerik?.description}"`);
    } else {
      logCurrentError('createReel returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createReel failed', err);
  }

  // --- CURRENT (V2) deleteReel ---
  console.log();
  logCurrentSection(`[CURRENT API Test] deleteReel (id: ${createdReelId ?? 'N/A'})`);
  if (createdReelId !== undefined) {
    try {
      const result = await apiCurrent.reels.deleteReel(createdReelId);
      if (result.durum === 1) {
        logCurrentSuccess(`Reel #${createdReelId} deleted.`);
      } else {
        logCurrentError('deleteReel returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deleteReel failed', err);
    }
  } else {
    logCurrentError('deleteReel skipped — no reel was created');
  }
}

runReelsTest();

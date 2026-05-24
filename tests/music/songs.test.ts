import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const SONG_ID = Number(process.env.ARMOYU_TEST_SONG_ID || '1');
const SEARCH_QUERY = process.env.ARMOYU_TEST_SONG_QUERY || 'İstasyon';

async function runMusicSongsTest() {
  console.log('--- Music Service: Songs (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getSongs ---
  console.log();
  logOldSection('[OLD API Test] getSongs');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.music.getSongs(1, 'oynatilabilir', 5);
    if (result.durum === 1) {
      logOldSuccess(`Songs fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(s =>
        console.log(`\x1b[36m  #${s.id} "${s.title}" — ${s.artist} | playable: ${s.isPlayable}\x1b[0m`)
      );
    } else {
      logOldError('getSongs returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getSongs failed', err);
  }

  // --- OLD (V1) searchSongs ---
  console.log();
  logOldSection(`[OLD API Test] searchSongs ("${SEARCH_QUERY}")`);
  try {
    const result = await apiOld.music.searchSongs(SEARCH_QUERY);
    if (result.durum === 1) {
      logOldSuccess(`Search results: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(s =>
        console.log(`\x1b[36m  #${s.id} "${s.title}" — ${s.artist}\x1b[0m`)
      );
    } else {
      logOldError('searchSongs returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD searchSongs failed', err);
  }

  // --- CURRENT (V2) getSongs ---
  console.log();
  logCurrentSection('[CURRENT API Test] getSongs');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.music.getSongs(1, '', 5);
    if (result.durum === 1) {
      logCurrentSuccess(`Songs fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(s =>
        console.log(`\x1b[33m  #${s.id} "${s.title}" — ${s.artist} | plays: ${s.listenCount}\x1b[0m`)
      );
    } else {
      logCurrentError('getSongs returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getSongs failed', err);
  }

  // --- CURRENT (V2) searchSongs ---
  console.log();
  logCurrentSection(`[CURRENT API Test] searchSongs ("${SEARCH_QUERY}")`);
  try {
    const result = await apiCurrent.music.searchSongs(SEARCH_QUERY);
    if (result.durum === 1) {
      logCurrentSuccess(`Search results: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(s =>
        console.log(`\x1b[33m  #${s.id} "${s.title}" — ${s.artist}\x1b[0m`)
      );
    } else {
      logCurrentError('searchSongs returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT searchSongs failed', err);
  }

  // --- CURRENT (V2) getSongDetail ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getSongDetail (id: ${SONG_ID})`);
  try {
    const result = await apiCurrent.music.getSongDetail(SONG_ID);
    if (result.durum === 1) {
      const s = result.icerik!;
      logCurrentSuccess(`Song detail: #${s.id} "${s.title}" — ${s.artist} | plays: ${s.listenCount}`);
    } else {
      logCurrentError('getSongDetail returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getSongDetail failed', err);
  }
}

runMusicSongsTest();

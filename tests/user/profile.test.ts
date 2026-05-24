import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const TEST_USERNAME = process.env.ARMOYU_TEST_USERNAME || 'testuser';

async function runUserTest() {
  console.log('--- User Service: Profile (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getUserByUsername ---
  console.log();
  logOldSection('[OLD API Test] getUserByUsername');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.users.getUserByUsername(TEST_USERNAME);
    if (result.durum === 1) {
      const u = result.icerik!;
      logOldSuccess(`Profile: #${u.id} @${u.username} — ${u.displayName} | level: ${u.level} | friends: ${u.stats?.friendsCount}`);
    } else {
      logOldError('getUserByUsername returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getUserByUsername failed', err);
  }

  // --- CURRENT (V2) getOwnProfile ---
  console.log();
  logCurrentSection('[CURRENT API Test] getOwnProfile');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.users.getOwnProfile();
    if (result.durum === 1) {
      const u = result.icerik!;
      logCurrentSuccess(`Own profile: #${u.id} @${u.username} — ${u.displayName} | level: ${u.level} | friends: ${u.stats?.friendsCount} | posts: ${u.stats?.postsCount}`);
      if (u.job?.name) console.log(`\x1b[33m  Job: ${u.job.name} (${u.job.shortName})\x1b[0m`);
      if (u.rank?.name) console.log(`\x1b[33m  Rank: ${u.rank.name} [${u.rank.category}]\x1b[0m`);
    } else {
      logCurrentError('getOwnProfile returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getOwnProfile failed', err);
  }

  // --- CURRENT (V2) updateSpecialPersonalInfo ---
  console.log();
  logCurrentSection('[CURRENT API Test] updateSpecialPersonalInfo');
  try {
    const password = process.env.ARMOYU_TEST_PASS || testPass;
    const result = await apiCurrent.users.updateSpecialPersonalInfo({
      passwordControl: password
    });
    if (result.durum === 1) {
      logCurrentSuccess('updateSpecialPersonalInfo OK');
    } else {
      logCurrentError('updateSpecialPersonalInfo returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT updateSpecialPersonalInfo failed', err);
  }

  // --- CURRENT (V2) resetAvatar ---
  console.log();
  logCurrentSection('[CURRENT API Test] resetAvatar');
  try {
    const result = await apiCurrent.users.resetAvatar();
    if (result.durum === 1) {
      logCurrentSuccess('resetAvatar OK');
    } else {
      logCurrentError('resetAvatar returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT resetAvatar failed', err);
  }

  // --- CURRENT (V2) resetBanner ---
  console.log();
  logCurrentSection('[CURRENT API Test] resetBanner');
  try {
    const result = await apiCurrent.users.resetBanner();
    if (result.durum === 1) {
      logCurrentSuccess('resetBanner OK');
    } else {
      logCurrentError('resetBanner returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT resetBanner failed', err);
  }

  // --- CURRENT (V2) resetWallpaper ---
  console.log();
  logCurrentSection('[CURRENT API Test] resetWallpaper');
  try {
    const result = await apiCurrent.users.resetWallpaper();
    if (result.durum === 1) {
      logCurrentSuccess('resetWallpaper OK');
    } else {
      logCurrentError('resetWallpaper returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT resetWallpaper failed', err);
  }
}

runUserTest();

import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const STORY_ID = Number(process.env.ARMOYU_TEST_STORY_ID || '96');

async function runStoryTest() {
  console.log('--- Story Service (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getStories ---
  console.log();
  logOldSection('[OLD API Test] getStories');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.stories.getStories(1, 10);
    if (result.durum === 1) {
      logOldSuccess(`Stories fetched! Authors: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(s =>
        console.log(`\x1b[36m  @${s.authorUsername} — ${s.storyCount} stories\x1b[0m`)
      );
    } else {
      logOldError('getStories returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getStories failed', err);
  }

  // --- CURRENT (V2) getStories ---
  console.log();
  logCurrentSection('[CURRENT API Test] getStories');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.stories.getStories(1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Stories fetched! Count: ${result.icerik?.length}`);
    } else {
      logCurrentError('getStories returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getStories failed', err);
  }

  // --- CURRENT (V2) getStoryViewers ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getStoryViewers (storyId: ${STORY_ID})`);
  try {
    const result = await apiCurrent.stories.getStoryViewers(1, STORY_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Viewers: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(v =>
        console.log(`\x1b[33m  @${v.username} — ${v.displayName} | viewed: ${v.date}\x1b[0m`)
      );
    } else {
      logCurrentError('getStoryViewers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getStoryViewers failed', err);
  }

  // --- CURRENT (V2) viewStory ---
  console.log();
  logCurrentSection(`[CURRENT API Test] viewStory (storyId: ${STORY_ID})`);
  try {
    const result = await apiCurrent.stories.viewStory(STORY_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Story #${STORY_ID} marked as viewed.`);
    } else {
      logCurrentError('viewStory returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT viewStory failed', err);
  }

  // --- CURRENT (V2) getStoryLikers ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getStoryLikers (storyId: ${STORY_ID})`);
  try {
    const result = await apiCurrent.stories.getStoryLikers(1, STORY_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Likers: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(l =>
        console.log(`\x1b[33m  @${l.username} — ${l.displayName} | liked: ${l.date}\x1b[0m`)
      );
    } else {
      logCurrentError('getStoryLikers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getStoryLikers failed', err);
  }

  // --- CURRENT (V2) likeStory → unlikeStory ---
  console.log();
  logCurrentSection(`[CURRENT API Test] likeStory (storyId: ${STORY_ID})`);
  try {
    const result = await apiCurrent.stories.likeStory(STORY_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Story #${STORY_ID} liked.`);
    } else {
      logCurrentError('likeStory returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT likeStory failed', err);
  }

  console.log();
  logCurrentSection(`[CURRENT API Test] unlikeStory (storyId: ${STORY_ID})`);
  try {
    const result = await apiCurrent.stories.unlikeStory(STORY_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Story #${STORY_ID} unliked.`);
    } else {
      logCurrentError('unlikeStory returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT unlikeStory failed', err);
  }
}

runStoryTest();

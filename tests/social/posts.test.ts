import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const POST_ID = Number(process.env.ARMOYU_TEST_POST_ID || '3334');

async function runSocialTest() {
  console.log('--- Social Service: Posts (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getPosts ---
  console.log();
  logOldSection('[OLD API Test] getPosts');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.social.getPosts(1, 5);
    if (result.durum === 1) {
      logOldSuccess(`Posts fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(p =>
        console.log(`\x1b[36m  #${p.id} @${p.owner.username} — likes: ${p.likesCount} | "${p.content?.slice(0, 50)}"\x1b[0m`)
      );
    } else {
      logOldError('getPosts returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getPosts failed', err);
  }

  // --- CURRENT (V2) getPosts ---
  console.log();
  logCurrentSection('[CURRENT API Test] getPosts');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.social.getPosts(1, 5);
    if (result.durum === 1) {
      logCurrentSuccess(`Posts fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(p =>
        console.log(`\x1b[33m  #${p.id} @${p.owner.username} — likes: ${p.likesCount} comments: ${p.commentsCount} media: ${p.mappedMedia.length} | "${p.content?.slice(0, 50)}"\x1b[0m`)
      );
    } else {
      logCurrentError('getPosts returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getPosts failed', err);
  }

  // --- CURRENT (V2) getPost (detail) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getPost (id: ${POST_ID})`);
  try {
    const result = await apiCurrent.social.getPost(POST_ID);
    if (result.durum === 1) {
      const p = result.icerik!;
      logCurrentSuccess(`Post detail: #${p?.id} by ${p?.owner.displayName} | likes: ${p?.likesCount} | comments: ${p?.topComments.length}`);
    } else {
      logCurrentError('getPost returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getPost failed', err);
  }

  // --- CURRENT (V2) createPost → updatePost → deletePost ---
  console.log();
  logCurrentSection('[CURRENT API Test] createPost');
  let createdPostId: number | undefined;
  try {
    const result = await apiCurrent.social.createPost('[test] otomatik paylaşım', [], 'Test Lokasyon');
    if (result.durum === 1) {
      logCurrentSuccess('Post created!');
      // V2 create returns null icerik, fetch latest to get id
      const listResult = await apiCurrent.social.getPosts(1, 1);
      createdPostId = listResult.icerik?.[0]?.id;
      if (createdPostId) logCurrentSuccess(`Created post id (inferred): ${createdPostId}`);
    } else {
      logCurrentError('createPost returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createPost failed', err);
  }

  if (createdPostId !== undefined) {
    console.log();
    logCurrentSection(`[CURRENT API Test] updatePost (id: ${createdPostId})`);
    try {
      const result = await apiCurrent.social.updatePost(createdPostId, '[test] güncellendi');
      if (result.durum === 1) {
        logCurrentSuccess(`Post #${createdPostId} updated.`);
      } else {
        logCurrentError('updatePost returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT updatePost failed', err);
    }

    console.log();
    logCurrentSection(`[CURRENT API Test] deletePost (id: ${createdPostId})`);
    try {
      const result = await apiCurrent.social.deletePost(createdPostId);
      if (result.durum === 1) {
        logCurrentSuccess(`Post #${createdPostId} deleted.`);
      } else {
        logCurrentError('deletePost returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deletePost failed', err);
    }
  }
}

runSocialTest();

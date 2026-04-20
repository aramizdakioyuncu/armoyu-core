import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runSocialTest() {
  console.log('--- Social Service Test ---');
  const { api } = createTestApi();

  // Phase 1: Posts
  try {
    const postsResponse = await api.social.getPosts(1);
    logSuccess(`Social posts fetched! Count: ${postsResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Social posts fetch failed', err);
  }
}

runSocialTest();

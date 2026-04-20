import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runBlogTest() {
  console.log('--- Blog Service Test ---');
  const { api } = createTestApi();

  // Phase 1: News List
  try {
    const newsResponse = await api.blog.getNews(1);
    logSuccess(`News list fetched! Count: ${newsResponse.icerik?.length}`);
  } catch (err: any) {
    logError('News fetch failed', err);
  }

  // Phase 2: News Search
  try {
    const searchResponse = await api.blog.searchNews(1, 'oyun');
    logSuccess(`News search results fetched! Count: ${searchResponse.icerik?.length}`);
  } catch (err: any) {
    logError('News search failed', err);
  }
}

runBlogTest();

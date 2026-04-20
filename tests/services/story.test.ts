import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runStoryTest() {
  console.log('--- Story Service Test ---');
  const { api } = createTestApi();

  try {
    const storiesResponse = await api.stories.getActiveStories(1);
    logSuccess(`Stories fetched! Count: ${storiesResponse.icerik?.length}`);
    if (storiesResponse.icerik && storiesResponse.icerik.length > 0) {
        const first = storiesResponse.icerik[0];
        console.log(`First Story Author: ${first.authorName} (${first.items.length} stories)`);
    }
  } catch (err: any) {
    logError('Stories fetch failed', err);
  }
}

runStoryTest();

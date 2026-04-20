import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runPollTest() {
  console.log('--- Poll Service Test ---');
  const { api } = createTestApi();

  // Phase 1: Polls List
  try {
    const pollsResponse = await api.polls.getPolls(1);
    logSuccess(`Polls list fetched! Count: ${pollsResponse.icerik?.length}`);
    
    if (pollsResponse.icerik && pollsResponse.icerik.length > 0) {
        const first = pollsResponse.icerik[0];
        console.log(`First Poll: ${first.question} (${first.id})`);
    }
  } catch (err: any) {
    logError('Polls fetch failed', err);
  }
}

runPollTest();

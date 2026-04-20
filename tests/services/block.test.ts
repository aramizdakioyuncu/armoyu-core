import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runBlockTest() {
  console.log('--- Block Service Test ---');
  const { api } = createTestApi();

  // Phase 1: Blocked Users List
  try {
    const blockList = await api.blocks.getBlockedUsers(1);
    logSuccess(`Blocked users list fetched! Count: ${blockList.icerik?.length}`);
  } catch (err: any) {
    logError('Blocked users fetch failed', err);
  }
}

runBlockTest();

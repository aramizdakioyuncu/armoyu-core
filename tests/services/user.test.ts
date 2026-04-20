import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runUserTest() {
  console.log('--- UserService Test ---');
  const { api, testUser } = createTestApi();

  // Phase 1: User Profile
  try {
    const profileResponse = await api.users.getUserByUsername(testUser);
    logSuccess(`Profile fetched for: ${profileResponse.icerik?.username}`);
  } catch (err: any) {
    logError('Profile fetch failed', err);
  }

  // Phase 2: Rankings
  try {
    const xpResponse = await api.users.getXpRankings(1, 10);
    logSuccess(`XP Rankings fetched! Count: ${xpResponse.icerik?.length}`);

    const popResponse = await api.users.getPopRankings(1, 10);
    logSuccess(`POP Rankings fetched! Count: ${popResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Rankings fetch failed', err);
  }
}

runUserTest();

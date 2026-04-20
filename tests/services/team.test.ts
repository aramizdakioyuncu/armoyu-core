import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runTeamTest() {
  console.log('--- Team Service Test ---');
  const { api } = createTestApi();

  try {
    const teamsResponse = await api.teams.getTeams();
    logSuccess(`Teams fetched! Count: ${teamsResponse.icerik?.length}`);
    if (teamsResponse.icerik && teamsResponse.icerik.length > 0) {
        console.log(`First Team: ${teamsResponse.icerik[0].name}`);
    }
  } catch (err: any) {
    logError('Teams fetch failed', err);
  }
}

runTeamTest();

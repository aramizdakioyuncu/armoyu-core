import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runLocationTest() {
  console.log('--- Location Service Test ---');
  const { api } = createTestApi();

  try {
    const provincesResponse = await api.locations.getProvinces(1, 212, 10);
    logSuccess(`Provinces fetched! Count: ${provincesResponse.icerik?.length}`);
    if (provincesResponse.icerik && provincesResponse.icerik.length > 0) {
        console.log(`First Province: ${provincesResponse.icerik[0].name}`);
    }
  } catch (err: any) {
    logError('Provinces fetch failed', err);
  }
}

runLocationTest();

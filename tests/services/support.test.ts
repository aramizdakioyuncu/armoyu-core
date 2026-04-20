import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runSupportTest() {
  console.log('--- Support Service Test ---');
  const { api } = createTestApi();

  // Phase 1: Support Tickets List
  try {
    const ticketsResponse = await api.support.getMyTickets(1);
    logSuccess(`Support tickets fetched! Count: ${ticketsResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Support tickets fetch failed', err);
  }
}

runSupportTest();

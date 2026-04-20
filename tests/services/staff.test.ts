import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runStaffTest() {
  console.log('--- Staff Service Test ---');
  const { api } = createTestApi();

  try {
    const staffResponse = await api.staff.getStaffList(1);
    logSuccess(`Staff list fetched! Count: ${staffResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Staff fetch failed', err);
  }
}

runStaffTest();

import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runCommunityTest() {
  console.log('--- Community (Search, Event, Group) Test ---');
  const { api } = createTestApi();

  // Phase 1: Search
  try {
    const searchResponse = await api.search.globalSearch('berkay');
    logSuccess(`Search results fetched! Count: ${searchResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Search failed', err);
  }

  // Phase 2: Events
  try {
    const eventsResponse = await api.events.getEvents(1);
    logSuccess(`Events list fetched! Count: ${eventsResponse.icerik?.length}`);
  } catch (err: any) {
    logError('Events fetch failed', err);
  }

  // Phase 3: Groups
  try {
    const groupsResponse = await api.groups.getGroups(1, 10);
    logSuccess(`Groups list fetched! Count: ${groupsResponse.icerik?.length}`);
    if (groupsResponse.icerik && groupsResponse.icerik.length > 0) {
      console.log('--- FIRST GROUP DATA ---');
      console.log(JSON.stringify(groupsResponse.icerik[0], null, 2));
    }

    if (groupsResponse.icerik && groupsResponse.icerik.length > 0) {
      const firstGroup = groupsResponse.icerik[0];
      const detailResponse = await api.groups.getGroupDetail({ groupName: firstGroup.url });
      logSuccess(`Group detail fetched for: ${detailResponse.icerik?.displayName}`);
    }
  } catch (err: any) {
    logError('Groups fetch failed', err);
  }
}

runCommunityTest();

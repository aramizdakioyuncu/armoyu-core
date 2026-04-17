import { ArmoyuApi } from '../src/api/ArmoyuApi';

/**
 * Global API Test using Environment Variables
 * Run with: node --env-file=.env npx tsx tests/api.test.ts
 */
async function test() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;
  const testUser = process.env.ARMOYU_TEST_USERNAME || 'deneme';
  const testPass = process.env.ARMOYU_TEST_PASSWORD || 'deneme';

  if (!apiKey) {
    console.error('ERROR: ARMOYU_API_KEY environment variable is not set.');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: `https://api.aramizdakioyuncu.com`,
    token: null // Start without token to force new login token in response
  });

  console.log(`--- Phase 1: Login (${testUser}/****) ---`);
  try {
    const loginResult = await api.auth.login(testUser, testPass);
    console.log('SUCCESS: Login completed!');
    console.log('User:', loginResult.icerik?.user.username);
    console.log('Token:', loginResult.icerik?.token || 'MISSING');
  } catch (err) {
    console.warn('⚠️ WARNING: Login failed. Falling back to ARMOYU_TOKEN from environment.');
    if (token) {
      api.setToken(token);
      console.log('Fallback Token set successfully.');
    } else {
      console.error('ERROR: No fallback token available in .env (ARMOYU_TOKEN).');
      return;
    }
  }

  console.log('\n--- Phase 2: Fetch User Profile (oyuncubak) ---');
  try {
    const meResponse = await api.users.getUserByUsername(testUser);
    const me = meResponse.icerik;
    console.log('SUCCESS: Profile fetched!');
    console.log('Profile Data:', JSON.stringify(me, null, 2));
  } catch (err) {
    console.error('ERROR in users.getUserByUsername:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 3: Search (arama) ---');
  try {
    const searchResponse = await api.search.globalSearch('berkay');
    const results = searchResponse.icerik || [];
    console.log('SUCCESS: Search fetched!');
    console.log('Search Results:', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('ERROR in globalSearch:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 4: Events (etkinlikler) ---');
  try {
    const resultsResponse = await api.events.getEvents(1);
    const results = resultsResponse.icerik || [];
    console.log('SUCCESS: Events fetched!');
    console.log('Events List:', JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('ERROR in getEvents:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 5: Rankings (XP & POP) ---');
  try {
    const xpRankingsResponse = await api.users.getXpRankings(1);
    const xpRankings = xpRankingsResponse.icerik || [];
    console.log('SUCCESS: XP Rankings fetched!');
    console.log('XP Rankings:', JSON.stringify(xpRankings, null, 2));

    const popRankingsResponse = await api.users.getPopRankings(1);
    const popRankings = popRankingsResponse.icerik || [];
    console.log('SUCCESS: POP Rankings fetched!');
    console.log('POP Rankings:', JSON.stringify(popRankings, null, 2));
  } catch (err) {
    console.error('ERROR in rankings:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 6: Groups (gruplar) ---');
  try {
    const groupsResponse = await api.groups.getGroups(1);
    const groups = groupsResponse.icerik || [];
    console.log('SUCCESS: Groups fetched!');
    console.log('Groups List:', JSON.stringify(groups, null, 2));

    if (groups.length > 0) {
      console.log('\n--- Fetching Detail for First Group ---');
      const firstGroup = groups[0];
      const detailResponse = await api.groups.getGroupDetail({ groupId: Number(firstGroup.id) });
      console.log(`SUCCESS: Detay fetched for ${firstGroup.name}!`);
      console.log('Group Detail:', JSON.stringify(detailResponse.icerik, null, 2));
    }
  } catch (err) {
    console.error('ERROR in groups:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 7: Social (sosyal postlar & yorumlar) ---');
  try {
    const postsResponse = await api.social.getPosts(1);
    const posts = postsResponse.icerik || [];
    console.log('SUCCESS: Posts fetched!');
    console.log('Posts List:', JSON.stringify(posts, null, 2));

    if (posts.length > 0) {
      console.log('\n--- Fetching Comments for First Post ---');
      const firstPost = posts[0];
      if (firstPost && firstPost.id) {
        const commentsResponse = await api.social.getComments(firstPost.id);
        console.log(`SUCCESS: Comments fetched for Post ID: ${firstPost.id}!`);
        console.log('Comments:', JSON.stringify(commentsResponse.icerik, null, 2));
      } else {
        console.warn('WARNING: First post missing solid ID, skipping comments test.');
      }
    }
  } catch (err) {
    console.error('ERROR in social:', err instanceof Error ? err.message : err);
  }
}

test();

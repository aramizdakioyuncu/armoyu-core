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
    token: token || null
  });

  console.log(`--- Phase 1: Login (${testUser}/****) ---`);
  try {
    const loginResult = await api.auth.login(testUser, testPass);
    console.log('SUCCESS: Login completed!');
    console.log('User:', loginResult.user.username);
    console.log('Token:', loginResult.session.token || 'MISSING');
  } catch (err) {
    console.error('ERROR during login:', err);
    return;
  }

  console.log('\n--- Phase 2: Fetch User Profile (oyuncubak) ---');
  try {
    const me = await api.users.getUserByUsername(testUser);
    console.log('SUCCESS: Profile fetched!');
    console.log('Username:', me?.username);
    console.log('Verified:', me?.verified);
    console.log('Rating:', me?.rating);
  } catch (err) {
    console.error('ERROR in users.getUserByUsername:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 3: Search (arama) ---');
  try {
    const results = await api.search.globalSearch('berkay');
    console.log('SUCCESS: Search fetched!');
    if (results.length > 0) {
      console.log(`First Result: [${results[0].type}] ${results[0].title}`);
    }
  } catch (err) {
    console.error('ERROR in globalSearch:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 4: Events (etkinlikler) ---');
  try {
    const results = await api.events.getEvents(0);
    console.log('SUCCESS: Events fetched!');
    if (results.length > 0) {
      console.log(`First Event: ${results[0].name} (Date: ${results[0].date})`);
      console.log(`Participants: ${results[0].getParticipantProgress()}`);
    } else {
      console.log('No events found.');
    }
  } catch (err) {
    console.error('ERROR in getEvents:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 5: Rankings (XP & POP) ---');
  try {
    const xpRankings = await api.users.getXpRankings(1);
    console.log('SUCCESS: XP Rankings fetched!');
    if (xpRankings && xpRankings.icerik && xpRankings.icerik.length > 0) {
      console.log(`Top Player (XP): ${xpRankings.icerik[0].kullaniciadi}`);
    }

    const popRankings = await api.users.getPopRankings(1);
    console.log('SUCCESS: POP Rankings fetched!');
    if (popRankings && popRankings.icerik && popRankings.icerik.length > 0) {
      console.log(`Top Player (POP): ${popRankings.icerik[0].kullaniciadi}`);
    }
  } catch (err) {
    console.error('ERROR in rankings:', err instanceof Error ? err.message : err);
  }
}

test();

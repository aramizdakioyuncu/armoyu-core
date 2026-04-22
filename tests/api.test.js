"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArmoyuApi_1 = require("../src/api/ArmoyuApi");
/**
 * Global API Test using Environment Variables
 * Run with: npx tsx --env-file=.env tests/api.test.ts
 * Run specific phase: PHASE=1 npx tsx --env-file=.env tests/api.test.ts
 */
async function test() {
    var _a, _b, _c, _d;
    const apiKey = process.env.ARMOYU_API_KEY;
    const token = process.env.ARMOYU_TOKEN;
    const testUser = process.env.ARMOYU_TEST_USERNAME || 'deneme';
    const testPass = process.env.ARMOYU_TEST_PASSWORD || 'deneme';
    const targetPhase = process.env.PHASE;
    if (!apiKey) {
        console.error('ERROR: ARMOYU_API_KEY environment variable is not set.');
        return;
    }
    const api = new ArmoyuApi_1.ArmoyuApi(apiKey, {
        baseUrl: 'https://api.aramizdakioyuncu.com',
        token: null,
        usePreviousVersion: true
    });
    const shouldRun = (phase) => !targetPhase || targetPhase === phase;
    // --- Phase 1: Login ---
    if (shouldRun('1')) {
        console.log(`--- Phase 1: Login (${testUser}/****) ---`);
        try {
            const loginResult = await api.auth.login(testUser, testPass);
            console.log('SUCCESS: Login completed!');
            console.log('User:', (_a = loginResult.icerik) === null || _a === void 0 ? void 0 : _a.user.username);
        }
        catch (err) {
            console.warn('⚠️ WARNING: Login failed:', err.message);
            if (token) {
                api.setToken(token);
                console.log('Fallback Token set successfully.');
            }
            else {
                console.error('ERROR: No fallback token available in .env (ARMOYU_TOKEN).');
                return;
            }
        }
    }
    else if (token) {
        api.setToken(token);
    }
    // --- Phase 2: User Profile ---
    if (shouldRun('2')) {
        console.log('\n--- Phase 2: Fetch User Profile (oyuncubak) ---');
        try {
            const meResponse = await api.users.getUserByUsername(testUser);
            console.log('SUCCESS: Profile fetched!');
            console.log('Profile Data (Mapped):', JSON.stringify(meResponse.icerik, null, 2));
        }
        catch (err) {
            console.error('ERROR in getUser:', err.message);
        }
    }
    // --- Phase 3: Search ---
    if (shouldRun('3')) {
        console.log('\n--- Phase 3: Search (arama) ---');
        try {
            const searchResponse = await api.search.globalSearch('berkay');
            console.log('SUCCESS: Search fetched!');
            console.log('Search Results (Mapped):', JSON.stringify((_b = searchResponse.icerik) === null || _b === void 0 ? void 0 : _b.slice(0, 2), null, 2));
        }
        catch (err) {
            console.error('ERROR in globalSearch:', err.message);
        }
    }
    // --- Phase 4: Events ---
    if (shouldRun('4')) {
        console.log('\n--- Phase 4: Events (etkinlikler) ---');
        try {
            const resultsResponse = await api.events.getEvents(1);
            console.log('SUCCESS: Events fetched!');
            console.log('Events List (Mapped):', JSON.stringify((_c = resultsResponse.icerik) === null || _c === void 0 ? void 0 : _c.slice(0, 1), null, 2));
        }
        catch (err) {
            console.error('ERROR in getEvents:', err.message);
        }
    }
    // --- Phase 5: Rankings ---
    if (shouldRun('5')) {
        console.log('\n--- Phase 5: Rankings (XP & POP) ---');
        try {
            await api.users.getXpRankings(1, 20);
            console.log('SUCCESS: XP Rankings fetched!');
            await api.users.getPopRankings(1, 20);
            console.log('SUCCESS: POP Rankings fetched!');
        }
        catch (err) {
            console.error('ERROR in rankings:', err.message);
        }
    }
    // --- Phase 6: Groups ---
    if (shouldRun('6')) {
        console.log('\n--- Phase 6: Groups (gruplar) ---');
        try {
            const groupsResponse = await api.groups.getGroups(1, 20);
            console.log('SUCCESS: Groups fetched!');
            const groups = groupsResponse.icerik || [];
            if (groups.length > 0) {
                const firstGroup = groups[0];
                const detailResponse = await api.groups.getGroupDetail({ groupName: firstGroup.url });
                console.log(`SUCCESS: Detay fetched for ${firstGroup.name}!`);
                console.log('Group Detail (Mapped):', JSON.stringify(detailResponse.icerik, null, 2));
            }
        }
        catch (err) {
            console.error('ERROR in groups:', err.message);
        }
    }
    // --- Phase 7: Social ---
    if (shouldRun('7')) {
        console.log('\n--- Phase 7: Social (sosyal postlar & yorumlar) ---');
        try {
            const postsResponse = await api.social.getPosts(1, 20);
            console.log('SUCCESS: Posts fetched!');
            const posts = postsResponse.icerik || [];
            if (posts.length > 0) {
                const commentsResponse = await api.social.getComments(posts[0].id);
                console.log(`SUCCESS: Comments fetched! Count:`, (_d = commentsResponse.icerik) === null || _d === void 0 ? void 0 : _d.length);
            }
        }
        catch (err) {
            console.error('ERROR in social:', err.message);
        }
    }
}
test();

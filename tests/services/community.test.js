"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runCommunityTest() {
    var _a, _b, _c, _d;
    console.log('--- Community (Search, Event, Group) Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: Search
    try {
        const searchResponse = await api.search.globalSearch('berkay');
        (0, test_helper_1.logSuccess)(`Search results fetched! Count: ${(_a = searchResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Search failed', err);
    }
    // Phase 2: Events
    try {
        const eventsResponse = await api.events.getEvents(1);
        (0, test_helper_1.logSuccess)(`Events list fetched! Count: ${(_b = eventsResponse.icerik) === null || _b === void 0 ? void 0 : _b.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Events fetch failed', err);
    }
    // Phase 3: Groups
    try {
        const groupsResponse = await api.groups.getGroups(1, 10);
        (0, test_helper_1.logSuccess)(`Groups list fetched! Count: ${(_c = groupsResponse.icerik) === null || _c === void 0 ? void 0 : _c.length}`);
        if (groupsResponse.icerik && groupsResponse.icerik.length > 0) {
            console.log('--- FIRST GROUP DATA ---');
            console.log(JSON.stringify(groupsResponse.icerik[0], null, 2));
        }
        if (groupsResponse.icerik && groupsResponse.icerik.length > 0) {
            const firstGroup = groupsResponse.icerik[0];
            const detailResponse = await api.groups.getGroupDetail({ groupName: firstGroup.url });
            (0, test_helper_1.logSuccess)(`Group detail fetched for: ${(_d = detailResponse.icerik) === null || _d === void 0 ? void 0 : _d.displayName}`);
        }
    }
    catch (err) {
        (0, test_helper_1.logError)('Groups fetch failed', err);
    }
}
runCommunityTest();

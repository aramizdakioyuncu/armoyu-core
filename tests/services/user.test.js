"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runUserTest() {
    var _a, _b, _c;
    console.log('--- UserService Test ---');
    const { api, testUser } = (0, test_helper_1.createTestApi)();
    // Phase 1: User Profile
    try {
        const profileResponse = await api.users.getUserByUsername(testUser);
        (0, test_helper_1.logSuccess)(`Profile fetched for: ${(_a = profileResponse.icerik) === null || _a === void 0 ? void 0 : _a.username}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Profile fetch failed', err);
    }
    // Phase 2: Rankings
    try {
        const xpResponse = await api.users.getXpRankings(1, 10);
        (0, test_helper_1.logSuccess)(`XP Rankings fetched! Count: ${(_b = xpResponse.icerik) === null || _b === void 0 ? void 0 : _b.length}`);
        const popResponse = await api.users.getPopRankings(1, 10);
        (0, test_helper_1.logSuccess)(`POP Rankings fetched! Count: ${(_c = popResponse.icerik) === null || _c === void 0 ? void 0 : _c.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Rankings fetch failed', err);
    }
}
runUserTest();

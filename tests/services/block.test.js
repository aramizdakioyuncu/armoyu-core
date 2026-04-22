"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runBlockTest() {
    var _a;
    console.log('--- Block Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: Blocked Users List
    try {
        const blockList = await api.blocks.getBlockedUsers(1);
        (0, test_helper_1.logSuccess)(`Blocked users list fetched! Count: ${(_a = blockList.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Blocked users fetch failed', err);
    }
}
runBlockTest();

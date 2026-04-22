"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runPollTest() {
    var _a;
    console.log('--- Poll Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: Polls List
    try {
        const pollsResponse = await api.polls.getPolls(1);
        (0, test_helper_1.logSuccess)(`Polls list fetched! Count: ${(_a = pollsResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
        if (pollsResponse.icerik && pollsResponse.icerik.length > 0) {
            const first = pollsResponse.icerik[0];
            console.log(`First Poll: ${first.question} (${first.id})`);
        }
    }
    catch (err) {
        (0, test_helper_1.logError)('Polls fetch failed', err);
    }
}
runPollTest();

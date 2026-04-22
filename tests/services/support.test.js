"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runSupportTest() {
    var _a;
    console.log('--- Support Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: Support Tickets List
    try {
        const ticketsResponse = await api.support.getMyTickets(1);
        (0, test_helper_1.logSuccess)(`Support tickets fetched! Count: ${(_a = ticketsResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Support tickets fetch failed', err);
    }
}
runSupportTest();

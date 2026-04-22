"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runRuleTest() {
    var _a;
    console.log('--- Rule Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    try {
        const rulesResponse = await api.rules.getRules(1);
        (0, test_helper_1.logSuccess)(`Rules list fetched! Count: ${(_a = rulesResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Rules fetch failed', err);
    }
}
runRuleTest();

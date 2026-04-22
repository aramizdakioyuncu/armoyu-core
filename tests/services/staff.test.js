"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runStaffTest() {
    var _a;
    console.log('--- Staff Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    try {
        const staffResponse = await api.staff.getStaffList(1);
        (0, test_helper_1.logSuccess)(`Staff list fetched! Count: ${(_a = staffResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Staff fetch failed', err);
    }
}
runStaffTest();

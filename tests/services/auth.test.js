"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runAuthTest() {
    var _a;
    console.log('--- AuthService Test ---');
    const { api, testUser, testPass } = (0, test_helper_1.createTestApi)();
    try {
        const loginResult = await api.auth.login(testUser, testPass);
        (0, test_helper_1.logSuccess)(`Login completed for user: ${(_a = loginResult.icerik) === null || _a === void 0 ? void 0 : _a.user.username}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Login failed', err);
    }
}
runAuthTest();

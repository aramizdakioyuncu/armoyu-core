"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runSocialTest() {
    var _a;
    console.log('--- Social Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: Posts
    try {
        const postsResponse = await api.social.getPosts(1);
        (0, test_helper_1.logSuccess)(`Social posts fetched! Count: ${(_a = postsResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Social posts fetch failed', err);
    }
}
runSocialTest();

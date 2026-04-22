"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runStoryTest() {
    var _a;
    console.log('--- Story Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    try {
        const storiesResponse = await api.stories.getActiveStories(1);
        (0, test_helper_1.logSuccess)(`Stories fetched! Count: ${(_a = storiesResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
        if (storiesResponse.icerik && storiesResponse.icerik.length > 0) {
            const first = storiesResponse.icerik[0];
            console.log(`First Story Author: ${first.authorName} (${first.items.length} stories)`);
        }
    }
    catch (err) {
        (0, test_helper_1.logError)('Stories fetch failed', err);
    }
}
runStoryTest();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runBlogTest() {
    var _a, _b;
    console.log('--- Blog Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: News List
    try {
        const newsResponse = await api.blog.getNews(1);
        (0, test_helper_1.logSuccess)(`News list fetched! Count: ${(_a = newsResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('News fetch failed', err);
    }
    // Phase 2: News Search
    try {
        const searchResponse = await api.blog.searchNews(1, 'oyun');
        (0, test_helper_1.logSuccess)(`News search results fetched! Count: ${(_b = searchResponse.icerik) === null || _b === void 0 ? void 0 : _b.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('News search failed', err);
    }
}
runBlogTest();

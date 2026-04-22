"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runChatTest() {
    var _a;
    console.log('--- Chat Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    // Phase 1: Friends Chat List
    try {
        const chatList = await api.chat.getFriends(1);
        (0, test_helper_1.logSuccess)(`Friends chat list fetched! Count: ${(_a = chatList.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Friends chat list fetch failed', err);
    }
    // Phase 2: Send Message
    try {
        const response = await api.chat.sendMessage(1, 'Test message');
        (0, test_helper_1.logSuccess)(`Message sent! Status: ${response.durum}`);
    }
    catch (err) {
        (0, test_helper_1.logError)('Send message failed', err);
    }
}
runChatTest();

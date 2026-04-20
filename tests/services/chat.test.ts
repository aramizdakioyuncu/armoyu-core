import { createTestApi, logSuccess, logError } from '../shared/test-helper';

async function runChatTest() {
  console.log('--- Chat Service Test ---');
  const { api } = createTestApi();

  // Phase 1: Friends Chat List
  try {
    const chatList = await api.chat.getFriends(1);
    logSuccess(`Friends chat list fetched! Count: ${chatList.icerik?.length}`);
  } catch (err: any) {
    logError('Friends chat list fetch failed', err);
  }

  // Phase 2: Send Message
  try {
    const response = await api.chat.sendMessage(1, 'Test message');
    logSuccess(`Message sent! Status: ${response.durum}`);
  } catch (err: any) {
    logError('Send message failed', err);
  }
}

runChatTest();

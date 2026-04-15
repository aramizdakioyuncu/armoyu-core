import { ArmoyuApi } from '../src/api/ArmoyuApi';
import * as fs from 'fs';


async function debugChat() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;

  if (!apiKey) {
    console.error('ARMOYU_API_KEY missing in .env');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://armoyu.com/api/proxy'
  });

  if (!token) {
    console.error('ARMOYU_TOKEN missing in .env');
    return;
  }

  api.setToken(token);

  console.log('--- Fetching Chat List ---');
  try {
    const response = await api.chat.getFriendsChat(1);
    fs.writeFileSync('./tests/debug_chat_list.json', JSON.stringify(response, null, 2));
    console.log('✅ Chat list saved to tests/debug_chat_list.json');

    const friends = Array.isArray(response) ? response : (response.icerik || []);
    if (friends.length > 0) {
        const first = friends[0];
        console.log('Keys in first friend:', Object.keys(first));
        const userId = first.oyuncubakid || first.oyuncuID || first.arkadasID || first.id;
        console.log('Target User ID for history:', userId);

        if (userId) {
            console.log('--- Fetching Chat History ---');
            // getChatHistory returns a Promise of any
            const history = await api.chat.getChatHistory(1, { userId: Number(userId) });
            fs.writeFileSync('./tests/debug_chat_history.json', JSON.stringify(history, null, 2));
            console.log('✅ Chat history saved to tests/debug_chat_history.json');
        } else {
            console.log('❌ Could not find a valid User ID in friend object');
        }
    } else {
        console.log('❌ No friends found in chat list');
    }
  } catch (err) {
    console.error('API Error:', err);
  }
}

debugChat();

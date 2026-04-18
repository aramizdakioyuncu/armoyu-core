import { ArmoyuApi } from '../src/api/ArmoyuApi';

/**
 * Social Post Creation Test
 * Run with: npx tsx --env-file=.env tests/social-create.test.ts
 */
async function test() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;

  if (!apiKey || !token) {
    console.error('ERROR: ARMOYU_API_KEY or ARMOYU_TOKEN environment variable is not set.');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: `https://api.aramizdakioyuncu.com`,
    token: token
  });

  console.log('--- Phase 1: Create Social Post ---');
  try {
    const content = 'Core Test Paylaşımı - ' + new Date().toLocaleString();
    console.log(`Gonderiliyor: "${content}"`);
    
    const result = await api.social.createPost(content, []);
    
    // capture raw response for deep debugging
    const rawResponse = (api as any).client.lastRawResponse;
    
    console.log('\n--- API Response Summary ---');
    console.log('Status:', result.durum === 1 ? '✅ SUCCESS' : '❌ FAILED');
    console.log('Description:', result.aciklama);
    
    if (rawResponse) {
        console.log('\n--- Raw Response Payload ---');
        console.log(JSON.stringify(rawResponse, null, 2));
    }

  } catch (err) {
    console.error('\n❌ ERROR during social post creation:', err);
    
    // Try to see if there was a raw response even on error
    const rawResponse = (api as any).client.lastRawResponse;
    if (rawResponse) {
        console.log('\n--- Raw Response Payload (on error) ---');
        console.log(JSON.stringify(rawResponse, null, 2));
    }
  }
}

test();

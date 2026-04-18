import { ArmoyuApi } from '../src/api/ArmoyuApi';

async function test() {
  const apiKey = process.env.ARMOYU_API_KEY || '5121eab7d46f1120f9527393ea19a0e9';
  const token = process.env.ARMOYU_TOKEN;

  const api = new ArmoyuApi(apiKey, {
    baseUrl: `https://api.aramizdakioyuncu.com`,
    token: token
  });

  console.log('--- Phase 1: auth.me (Self) ---');
  try {
    const result = await (api.auth as any).me();
    const rawResponse = (api as any).client.lastRaw;
    console.log('\n--- Raw Self Response (JSON) ---');
    console.log(JSON.stringify(rawResponse, null, 2));
  } catch (err) {
    console.error('Self fetch error:', err);
  }
}

test();

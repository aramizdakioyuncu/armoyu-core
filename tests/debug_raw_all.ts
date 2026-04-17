import { ArmoyuApi } from '../src/api/ArmoyuApi';
import * as fs from 'fs';

/**
 * Debug script to capture RAW JSON from all major endpoints.
 * Run with: npx tsx --env-file=.env tests/debug_raw_all.ts
 */
async function debug() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;
  const testUser = process.env.ARMOYU_TEST_USERNAME || 'deneme';
  const testPass = process.env.ARMOYU_TEST_PASSWORD || 'deneme';

  if (!apiKey) {
    console.error('ARMOYU_API_KEY missing');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token || null
  });

  const rawData: any = {};

  console.log('--- Capturing Login ---');
  try {
    const formData = new FormData();
    formData.append('username', testUser);
    formData.append('password', testPass);
    formData.append('kullaniciadi', testUser);
    formData.append('parola', testPass);
    const response = await (api as any).client.post(api.auth['resolveBotPath']('/0/0/0'), formData);
    rawData.login = response;
  } catch (err) { rawData.login_error = String(err); }

  console.log('--- Capturing Profile ---');
  try {
    const formData = new FormData();
    formData.append('oyuncubakusername', testUser);
    const response = await (api as any).client.post(api.users['resolveBotPath']('/0/0/0/'), formData);
    rawData.profile = response;
  } catch (err) { rawData.profile_error = String(err); }

  console.log('--- Capturing Search ---');
  try {
    const formData = new FormData();
    formData.append('oyuncuadi', 'berkay');
    formData.append('sayfa', '1');
    formData.append('limit', '5');
    const response = await (api as any).client.post(api.search['resolveBotPath']('/0/0/arama/1/5/'), formData);
    rawData.search = response;
  } catch (err) { rawData.search_error = String(err); }

  console.log('--- Capturing Events ---');
  try {
    const formData = new FormData();
    formData.append('sayfa', '1');
    const response = await (api as any).client.post(api.events['resolveBotPath']('/0/0/etkinlikler/liste/1/'), formData);
    rawData.events = response;
  } catch (err) { rawData.events_error = String(err); }

  fs.writeFileSync('./tests/raw_api_dump.json', JSON.stringify(rawData, null, 2));
  console.log('✅ RAW JSON dumped to tests/raw_api_dump.json');
}

debug();

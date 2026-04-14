import { ArmoyuApi } from '../src/api/ArmoyuApi';

/**
 * Script to test the BusinessService.joinBusiness method with more detail.
 */
async function testJoinDetailed() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;
  const cookie = process.env.ARMOYU_TEST_COOKIE || '';

  if (!apiKey) {
    console.error('ERROR: ARMOYU_API_KEY environment variable is not set.');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token || null,
    headers: {
      'Cookie': cookie
    }
  });

  console.log('--- Testing Business Join (Detailed) ---');
  try {
    // We'll use the client directly to see the WHOLE response
    const formData = new FormData();
    formData.append('isyeriidi', '0');
    formData.append('hangisinif', '0');
    formData.append('hangibrans', '0');
    formData.append('sinifsifresi', '');

    const url = `/botlar/${apiKey}/0/0/isyerleri/katilim/0/`;
    const response = await (api as any).client.post(url, formData);
    
    console.log('Full API Response:', JSON.stringify(response, null, 2));
    
    if (response.durum === 1) {
      console.log('SUCCESS: API returned status 1');
    } else {
      console.log('FAILED: API returned status', response.durum);
      console.log('Reason:', response.aciklama);
    }
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : err);
  }
}

testJoinDetailed();

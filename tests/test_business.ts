import { ArmoyuApi } from '../src/api/ArmoyuApi';

/**
 * Script to test the BusinessService.joinBusiness method with more detail.
 */
async function testJoinDetailed() {
  const apiKey = '5121eab7d46f1120f9527393ea19a0e9';
  const token = '5221d07eb0049191ed17b3d1ea773941aa3ab1960c9696c64de2281766d13df2';

  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token,
    headers: {
      'Cookie': 'kullanici_id=11107; oturumsezonanahtari=ee4ae2ee8b4fc8deb3532a7b1767c3d5; oturumtipi=4'
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

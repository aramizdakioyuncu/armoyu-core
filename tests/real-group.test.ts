import { ArmoyuApi } from '../src/api/ArmoyuApi';
import * as fs from 'fs';

/**
 * Real API Test to capture Group List JSON for analysis.
 * Run with: npx tsx --env-file=.env tests/real-group.test.ts
 */
async function test() {
  const apiKey = process.env.ARMOYU_API_KEY;
  const token = process.env.ARMOYU_TOKEN;

  if (!apiKey) {
    console.error('ERROR: ARMOYU_API_KEY environment variable is not set.');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: `https://api.aramizdakioyuncu.com`,
    token: token || null
  });

  console.log('--- Fetching Group List via Service ---');
  try {
    // Calling the service method will use the correct bot path
    const groups = await api.groups.getGroups({ page: 1 });
    
    // Get the RAW response from the client's lastRawResponse
    const rawResponse = (api as any).client.lastRawResponse;
    
    if (rawResponse) {
      fs.writeFileSync('./tests/debug_groups.json', JSON.stringify(rawResponse, null, 2));
      console.log('✅ SUCCESS: Raw response saved to tests/debug_groups.json');
      
      const targetGroup = groups.find(g => g.name.includes('İttihat')) || groups[0];

      if (targetGroup) {
         console.log('\n--- Final Mapped Group ---');
         console.log('ID:', targetGroup.id);
         console.log('Name:', targetGroup.name);
         console.log('ShortName:', targetGroup.shortName);
         console.log('Category:', targetGroup.category);
         console.log('Tag (CategoryDetail):', targetGroup.tag);
         console.log('Slug:', targetGroup.slug);
         console.log('Logo:', targetGroup.logo);
         console.log('Owner Name:', targetGroup.owner?.displayName);
         
         if (targetGroup.category) {
           console.log('✅ SUCCESS: Category is populated!');
         } else {
           console.warn('❌ WARNING: Category is STILL EMPTY.');
         }
      }
    } else {
      console.error('❌ ERROR: No raw response captured.');
    }
  } catch (err) {
    console.error('ERROR during API test:', err);
  }
}

test();

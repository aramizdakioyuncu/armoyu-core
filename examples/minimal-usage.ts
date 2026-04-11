import { ArmoyuApi } from '../src';

/**
 * ARMOYU Core - Manual Query Example
 * 
 * Edit this file to test your own queries and see how the enriched models work!
 * Run this with: npx tsx examples/minimal-usage.ts
 */
async function main() {
  // 1. Initial configuration
  const apiKey = process.env.ARMOYU_API_KEY || 'your_api_key_here';
  const token = process.env.ARMOYU_TOKEN || null;
  
  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token
  });

  console.log('--- ARMOYU Manual Query Example ---\n');

  try {
    // --- QUERY 1: Fetch User Profile ---
    console.log('1. Fetching user: deneme...');
    const user = await api.users.getUserByUsername('deneme');
    if (user) {
      console.log(`   Found: ${user.getName()} (Level ${user.level})`);
      console.log(`   Rating: ${user.rating} | Rank: ${user.rankTitle}`);
      console.log(`   Location: ${user.city}, ${user.country}`);
      console.log(`   Popular Games: ${user.popularGames.map(g => g.name).join(', ')}`);
    }

    // --- QUERY 2: Global Search ---
    console.log('\n2. Searching for: "berkay"...');
    const results = await api.search.globalSearch('berkay');
    console.log(`   Found ${results.length} results.`);
    results.slice(0, 3).forEach(r => {
      console.log(`   - [${r.type}] ${r.title} (@${r.username})`);
    });

    // --- QUERY 3: Fetch News ---
    console.log('\n3. Fetching latest news...');
    // Using custom post to the specific path mentioned earlier
    const newsResponse = await (api as any).client.post('/0/0/haberler/0/0/', {});
    if (newsResponse.icerik && newsResponse.icerik.length > 0) {
       console.log(`   Latest News: ${newsResponse.icerik[0].haberbaslik}`);
       console.log(`   Author: ${newsResponse.icerik[0].yazar} | Views: ${newsResponse.icerik[0].goruntulen}`);
    }

  } catch (error) {
    console.error('ERROR during manual query:', error);
  }
}

main();

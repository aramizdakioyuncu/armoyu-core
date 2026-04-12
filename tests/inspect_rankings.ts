import { ArmoyuApi } from '../src/api/ArmoyuApi';
import { RankedUser } from '../src/models/auth/RankedUser';

/**
 * Script to verify the RankedUser mapping and service integration.
 */
async function verify() {
  const apiKey = '5121eab7d46f1120f9527393ea19a0e9';
  const token = '5221d07eb0049191ed17b3d1ea773941aa3ab1960c9696c64de2281766d13df2';

  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token
  });

  console.log('--- Verifying XP Rankings (using UserService) ---');
  try {
    const xpRankings = await api.users.getXpRankings(1);
    
    console.log(`Fetched ${xpRankings.length} players.`);
    if (xpRankings.length > 0) {
      const first = xpRankings[0];
      console.log('Sample RankedUser:', JSON.stringify(first, null, 2));
      console.log('Is instance of RankedUser:', first instanceof RankedUser);
      
      if (first.username) {
        console.log('SUCCESS: Mapping verified!');
      } else {
        console.error('ERROR: Mapping failed, username is empty.');
      }
    }
  } catch (err) {
    console.error('Error during verification:', err);
  }

  console.log('\n--- Verifying POP Rankings (using UserService) ---');
  try {
    const popRankings = await api.users.getPopRankings(1);
    console.log(`Fetched ${popRankings.length} players.`);
    if (popRankings.length > 0) {
      const first = popRankings[0];
      console.log('Sample RankedUser (POP):', first.username, '-', first.popScore, 'pts');
    }
  } catch (err) {
    console.error('Error during POP verification:', err);
  }
}

verify();

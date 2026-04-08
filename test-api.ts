import { ArmoyuApi } from './src/api/ArmoyuApi';

/**
 * Final Real API Test with provided credentials
 */
async function test() {
  const apiKey = 'bda0b6f27fc1a6a87e8ba8cd9ab339ca';
  const api = new ArmoyuApi({
    baseUrl: `https://api.armoyu.com/botlar/${apiKey}`,
    apiKey: apiKey
  });

  console.log('--- Phase 1: Login (deneme/deneme) ---');
  try {
    const loginResult = await api.auth.login('deneme', 'deneme');
    console.log('SUCCESS: Login completed!');
    console.log('User:', loginResult.user.username);
    console.log('Token:', loginResult.session.token || 'MISSING');
    
    if (!loginResult.session.token) {
        console.warn('WARNING: Token is empty. Check mapping.');
    }
  } catch (err) {
    console.error('ERROR during login:', err);
    if (err && typeof err === 'object' && 'data' in err) {
        console.error('API Error Data:', JSON.stringify(err.data, null, 2));
    }
    return;
  }

  console.log('\n--- Phase 2: Fetch Me (using token) ---');
  try {
    const me = await api.auth.me();
    console.log('SUCCESS: Profile fetched!');
    console.log('Username:', me?.username);
    console.log('Verified:', me?.verified);
  } catch (err) {
    console.error('ERROR in auth.me:', err instanceof Error ? err.message : err);
  }

  console.log('\n--- Phase 3: Fetch Rules ---');
  try {
    const rules = await api.rules.getRules('0');
    console.log('SUCCESS: Rules fetched, count:', rules.length);
    if (rules.length > 0) {
      console.log('First Rule:', rules[0].text);
    }
  } catch (err) {
    console.error('ERROR in rules.getRules:', err instanceof Error ? err.message : err);
  }
}

test();

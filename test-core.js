const { armoyu } = require('./dist/index');

console.log('--- ARMOYU CORE TEST ---');

// 1. Initial State
console.log('1. Initial API Key:', armoyu.auth['client'].config.apiKey);

// 2. Set Config
console.log('2. Setting apiKey to 12345...');
armoyu.setConfig({ apiKey: '12345' });

// 3. Verify State
const currentKey = armoyu.auth['client'].config.apiKey;
console.log('3. Updated API Key:', currentKey);

if (currentKey === '12345') {
  console.log('✅ Success: API Key correctly updated via setConfig!');
} else {
  console.log('❌ Failure: API Key update failed.');
  process.exit(1);
}

console.log('--- TEST COMPLETED ---');

import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const RULE_ID = Number(process.env.ARMOYU_TEST_RULE_ID || '1');

async function runRuleTest() {
  console.log('--- Rule Service (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getRules ---
  console.log();
  logOldSection('[OLD API Test] getRules');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.rules.getRules(1);
    if (result.durum === 1) {
      logOldSuccess(`Rules fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(r =>
        console.log(`\x1b[36m  #${r.id} "${r.content?.slice(0, 60)}..."\x1b[0m`)
      );
    } else {
      logOldError('getRules returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getRules failed', err);
  }

  // --- CURRENT (V2) getRules ---
  console.log();
  logCurrentSection('[CURRENT API Test] getRules');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.rules.getRules(1);
    if (result.durum === 1) {
      logCurrentSuccess(`Rules fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(r =>
        console.log(`\x1b[33m  #${r.id} penalty: ${r.penaltySeconds}s | "${r.content?.slice(0, 60)}..."\x1b[0m`)
      );
    } else {
      logCurrentError('getRules returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getRules failed', err);
  }

  // --- CURRENT (V2) getRule (detail) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getRule (id: ${RULE_ID})`);
  try {
    const result = await apiCurrent.rules.getRule(RULE_ID);
    if (result.durum === 1) {
      const r = result.icerik!;
      logCurrentSuccess(`Rule detail: #${r.id} penalty: ${r.penaltySeconds}s date: ${r.date}`);
      console.log(`\x1b[33m  "${r.content}"\x1b[0m`);
    } else {
      logCurrentError('getRule returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getRule failed', err);
  }

  // --- CURRENT (V2) createRule → updateRule → deleteRule ---
  console.log();
  logCurrentSection('[CURRENT API Test] createRule');
  let createdRuleId: number | undefined;
  try {
    const result = await apiCurrent.rules.createRule({
      content: '[test] otomatik oluşturuldu',
      penalty: 60,
      submadde: null
    });
    if (result.durum === 1) {
      const rule = result.icerik;
      if (rule && typeof rule === 'object' && 'id' in rule) {
        createdRuleId = (rule as any).id;
        logCurrentSuccess(`Rule created! id: ${createdRuleId}`);
      } else {
        logCurrentSuccess('Rule created (V1 boolean response)');
      }
    } else {
      logCurrentError('createRule returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createRule failed', err);
  }

  if (createdRuleId !== undefined) {
    console.log();
    logCurrentSection(`[CURRENT API Test] updateRule (id: ${createdRuleId})`);
    try {
      const result = await apiCurrent.rules.updateRule(createdRuleId, {
        content: '[test] güncellendi',
        penalty: 120,
        submadde: null
      });
      if (result.durum === 1) {
        logCurrentSuccess(`Rule updated! #${result.icerik?.id} "${result.icerik?.content}"`);
      } else {
        logCurrentError('updateRule returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT updateRule failed', err);
    }

    console.log();
    logCurrentSection(`[CURRENT API Test] deleteRule (id: ${createdRuleId})`);
    try {
      const result = await apiCurrent.rules.deleteRule(createdRuleId);
      if (result.durum === 1) {
        logCurrentSuccess(`Rule #${createdRuleId} deleted.`);
      } else {
        logCurrentError('deleteRule returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deleteRule failed', err);
    }
  }
}

runRuleTest();

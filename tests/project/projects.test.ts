import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const PROJECT_ID = Number(process.env.ARMOYU_TEST_PROJECT_ID || '1');

async function runProjectTest() {
  console.log('--- Project Service: Projects (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getProjects ---
  console.log();
  logOldSection('[OLD API Test] getProjects');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.projects.getProjects();
    if (result.durum === 1) {
      logOldSuccess(`Projects fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(p =>
        console.log(`\x1b[36m  #${p.id} "${p.name}" — url: ${p.url}\x1b[0m`)
      );
    } else {
      logOldError('getProjects returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getProjects failed', err);
  }

  // --- CURRENT (V2) getProjects ---
  console.log();
  logCurrentSection('[CURRENT API Test] getProjects');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.projects.getProjects(1, 5);
    if (result.durum === 1) {
      logCurrentSuccess(`Projects fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(p =>
        console.log(`\x1b[33m  #${p.id} "${p.name}" v${p.version} [${p.language?.name ?? 'N/A'}] — members: ${p.members?.length ?? 0} | owner: ${p.owner?.groupName ?? 'none'}\x1b[0m`)
      );
    } else {
      logCurrentError('getProjects returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getProjects failed', err);
  }

  // --- CURRENT (V2) getProject (detail) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getProject (id: ${PROJECT_ID})`);
  try {
    const result = await apiCurrent.projects.getProject(PROJECT_ID);
    if (result.durum === 1) {
      const p = result.icerik!;
      logCurrentSuccess(`Project detail: #${p.id} "${p.name}" v${p.version} | shortname: ${p.shortname} | members: ${p.members?.length ?? 0}`);
      p.members?.slice(0, 2).forEach(m =>
        console.log(`\x1b[33m    - ${m.displayName} (@${m.username}) role: ${m.role} joined: ${m.joinTime}\x1b[0m`)
      );
    } else {
      logCurrentError('getProject returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getProject failed', err);
  }

  // --- CURRENT (V2) getMembers ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getMembers (project: ${PROJECT_ID})`);
  try {
    const result = await apiCurrent.projects.getMembers(PROJECT_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Members fetched! Count: ${result.icerik?.length}`);
      result.icerik?.forEach(m =>
        console.log(`\x1b[33m    [${m.rowId}] ${m.displayName} (@${m.username}) type: ${m.type} joined: ${m.joinTime}\x1b[0m`)
      );
    } else {
      logCurrentError('getMembers returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getMembers failed', err);
  }

  // --- CURRENT (V2) getScoreList ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getScoreList (project: ${PROJECT_ID})`);
  try {
    const result = await apiCurrent.projects.getScoreList(PROJECT_ID);
    if (result.durum === 1) {
      logCurrentSuccess(`Scores fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(s =>
        console.log(`\x1b[33m    #${s.rank} ${s.playerName} — score: ${s.score}\x1b[0m`)
      );
    } else {
      logCurrentError('getScoreList returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getScoreList failed', err);
  }
}

runProjectTest();

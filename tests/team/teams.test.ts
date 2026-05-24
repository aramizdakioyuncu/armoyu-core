import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

async function runTeamTest() {
  console.log('--- Team Service (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getTeams ---
  console.log();
  logOldSection('[OLD API Test] getTeams');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.teams.getTeams(1, 10);
    if (result.durum === 1) {
      logOldSuccess(`Teams fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(t =>
        console.log(`\x1b[36m  #${t.id} — ${t.name} | logo: ${t.logo?.slice(0, 60)}\x1b[0m`)
      );
    } else {
      logOldError('getTeams returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getTeams failed', err);
  }

  // --- CURRENT (V2) getTeams ---
  console.log();
  logCurrentSection('[CURRENT API Test] getTeams');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.teams.getTeams(1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Teams fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(t =>
        console.log(`\x1b[33m  #${t.id} — ${t.name} | logo: ${t.logo?.slice(0, 60)}\x1b[0m`)
      );
    } else {
      logCurrentError('getTeams returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getTeams failed', err);
  }

  // --- CURRENT (V2) createTeam → deleteTeam ---
  console.log();
  logCurrentSection('[CURRENT API Test] createTeam');
  let createdTeamId: number | undefined;
  try {
    const result = await apiCurrent.teams.createTeam({ name: '[test] armoyu-core-team' });
    if (result.durum === 1) {
      createdTeamId = result.icerik?.id;
      logCurrentSuccess(`Team created! id: ${createdTeamId} — ${result.icerik?.name}`);
    } else {
      logCurrentError('createTeam returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createTeam failed', err);
  }

  if (createdTeamId !== undefined) {
    console.log();
    logCurrentSection(`[CURRENT API Test] deleteTeam (id: ${createdTeamId})`);
    try {
      const result = await apiCurrent.teams.deleteTeam(createdTeamId);
      if (result.durum === 1) {
        logCurrentSuccess(`Team #${createdTeamId} deleted.`);
      } else {
        logCurrentError('deleteTeam returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deleteTeam failed', err);
    }
  }
}

runTeamTest();

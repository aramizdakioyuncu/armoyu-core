import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

async function runGroupCrudTest() {
  console.log('--- Group Service: Create & Update (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) createGroup ---
  console.log();
  logOldSection('[OLD API Test] createGroup');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.groups.createGroup({
      name: 'Test Grup V1',
      shortName: 'TGV1',
      categoryId: 3,
      categoryDetailId: 11
    });
    if (result.durum === 1) {
      logOldSuccess(`Group created! #${result.icerik?.id} "${result.icerik?.name}"`);
    } else {
      logOldError('createGroup returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD createGroup failed', err);
  }

  // --- CURRENT (V2) createGroup ---
  console.log();
  logCurrentSection('[CURRENT API Test] createGroup');
  let createdId: number | null = null;
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.groups.createGroup({
      name: 'Test Grup V2',
      shortName: 'TGV2',
      categoryId: 3,
      categoryDetailId: 11
    });
    if (result.durum === 1 && result.icerik) {
      createdId = result.icerik.id;
      logCurrentSuccess(`Group created! #${result.icerik.id} "${result.icerik.name}"`);
    } else {
      logCurrentError('createGroup returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createGroup failed', err);
  }

  // --- CURRENT (V2) updateGroupSettings ---
  if (createdId !== null) {
    console.log();
    logCurrentSection('[CURRENT API Test] updateGroupSettings');
    try {
      const result = await apiCurrent.groups.updateGroupSettings(createdId, {
        description: 'Test açıklaması güncellendi.'
      });
      if (result.durum === 1) {
        logCurrentSuccess(`Group #${createdId} updated! "${result.icerik?.name}"`);
      } else {
        logCurrentError('updateGroupSettings returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT updateGroupSettings failed', err);
    }
  }
}

runGroupCrudTest();

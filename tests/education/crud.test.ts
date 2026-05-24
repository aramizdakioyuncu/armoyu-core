import {
  createTestClients,
  logOldSuccess, logOldError,
  logCurrentSuccess, logCurrentError,
  logOldSection, logCurrentSection
} from '../shared/test-helper';

const SCHOOL_ID = Number(process.env.ARMOYU_TEST_SCHOOL_ID || '1');

async function runEducationCrudTest() {
  console.log('--- Education Service: Add / Update / Delete Classroom (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) ---
  console.log();
  logOldSection('[OLD API Test] addClassroom');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.education.addClassroom(SCHOOL_ID, { name: 'Test Sınıfı (V1)', type: 'sinif' });
    if (result.durum === 1) {
      logOldSuccess(`Classroom created! #${result.icerik?.id} "${result.icerik?.name}"`);
    } else {
      logOldError('addClassroom returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD addClassroom failed', err);
  }

  // --- CURRENT (V2) addClassroom ---
  console.log();
  logCurrentSection('[CURRENT API Test] addClassroom');
  let createdId: number | null = null;
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.education.addClassroom(SCHOOL_ID, { name: 'Test Sınıfı (V2)', type: 'sinif' });
    if (result.durum === 1 && result.icerik) {
      createdId = result.icerik.id;
      logCurrentSuccess(`Classroom created! #${result.icerik.id} "${result.icerik.name}"`);
    } else {
      logCurrentError('addClassroom returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT addClassroom failed', err);
  }

  // --- CURRENT (V2) updateClassroom ---
  if (createdId !== null) {
    console.log();
    logCurrentSection('[CURRENT API Test] updateClassroom');
    try {
      const result = await apiCurrent.education.updateClassroom(createdId, { name: 'Test Sınıfı (V2 Updated)' });
      if (result.durum === 1) {
        logCurrentSuccess(`Classroom #${createdId} updated! "${result.icerik?.name}"`);
      } else {
        logCurrentError('updateClassroom returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT updateClassroom failed', err);
    }

    // --- CURRENT (V2) deleteClassroom ---
    console.log();
    logCurrentSection('[CURRENT API Test] deleteClassroom');
    try {
      const result = await apiCurrent.education.deleteClassroom(createdId);
      if (result.durum === 1) {
        logCurrentSuccess(`Classroom #${createdId} deleted!`);
      } else {
        logCurrentError('deleteClassroom returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deleteClassroom failed', err);
    }
  }
}

runEducationCrudTest();

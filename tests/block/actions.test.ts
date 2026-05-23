import {
  createTestClients,
  logCurrentSuccess, logCurrentError,
  logCurrentSection
} from '../shared/test-helper';

const TARGET_USER_ID = 1; // berkaytikenoglu

async function checkInList(apiCurrent: any, shouldExist: boolean): Promise<boolean> {
  const listResult = await apiCurrent.blocks.getBlockedUsers(1);
  if (listResult.durum !== 1) {
    logCurrentError('getBlockedUsers failed', listResult.aciklama);
    return false;
  }

  const found = listResult.icerik?.some((u: any) => u.userId === TARGET_USER_ID);
  const status = found ? 'BULUNDU ✓' : 'BULUNAMADI ✗';

  if (found === shouldExist) {
    logCurrentSuccess(`Liste kontrolü → Kullanıcı ${status} (beklenen: ${shouldExist ? 'var' : 'yok'})`);
    return true;
  } else {
    logCurrentError(`Liste kontrolü başarısız → Kullanıcı ${status} (beklenen: ${shouldExist ? 'var' : 'yok'})`);
    return false;
  }
}

/**
 * Full flow:
 *   1. Unblock  → listele (kullanıcı yok olmalı)
 *   2. Block    → listele (kullanıcı var olmalı)
 *   3. Unblock  → listele (kullanıcı yok olmalı – başlangıç durumuna dön)
 */
async function runBlockActionsTest() {
  console.log('--- Block Service: Block/Unblock Actions (CURRENT only) ---');
  const { apiCurrent, testUser, testPass } = createTestClients();

  logCurrentSection('[CURRENT API Test] blockUser / unblockUser');

  await apiCurrent.auth.login(testUser, testPass);

  // ── 1. UNBLOCK ──────────────────────────────────────────
  console.log('\n[1/6] Engeli kaldır...');
  const unblock1 = await apiCurrent.blocks.unblockUser(TARGET_USER_ID);
  if (unblock1.durum === 1) {
    logCurrentSuccess(`Engel kaldırıldı: ${unblock1.aciklama}`);
  } else {
    logCurrentError('Engel kaldırma başarısız', unblock1.aciklama);
  }

  // ── 2. LIST → kullanıcı listede olmamalı ────────────────
  console.log('\n[2/6] Liste kontrol (kullanıcı YOK olmalı)...');
  await checkInList(apiCurrent, false);

  // ── 3. BLOCK ────────────────────────────────────────────
  console.log('\n[3/6] Engelle...');
  const block1 = await apiCurrent.blocks.blockUser(TARGET_USER_ID);
  if (block1.durum === 1) {
    logCurrentSuccess(`Engellendi: ${block1.aciklama}`);
  } else {
    logCurrentError('Engelleme başarısız', block1.aciklama);
  }

  // ── 4. LIST → kullanıcı listede olmalı ──────────────────
  console.log('\n[4/6] Liste kontrol (kullanıcı VAR olmalı)...');
  await checkInList(apiCurrent, true);

  // ── 5. UNBLOCK (geri al) ─────────────────────────────────
  console.log('\n[5/6] Engeli tekrar kaldır (durumu sıfırla)...');
  const unblock2 = await apiCurrent.blocks.unblockUser(TARGET_USER_ID);
  if (unblock2.durum === 1) {
    logCurrentSuccess(`Engel kaldırıldı: ${unblock2.aciklama}`);
  } else {
    logCurrentError('Engel kaldırma başarısız', unblock2.aciklama);
  }

  // ── 6. LIST → kullanıcı tekrar listede olmamalı ──────────
  console.log('\n[6/6] Liste kontrol (kullanıcı tekrar YOK olmalı)...');
  await checkInList(apiCurrent, false);

  console.log('\nTest tamamlandı.');
}

runBlockActionsTest();

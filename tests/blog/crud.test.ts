import {
  createTestClients,
  logCurrentSuccess, logCurrentError,
  logCurrentSection
} from '../shared/test-helper';

/**
 * Full CRUD flow (CURRENT/V2 only):
 *   1. Create → kaydet haberID
 *   2. Detail → oluşturulan haberi getir
 *   3. Update → güncelle
 *   4. Detail → güncellendiğini doğrula
 *   5. Delete → sil
 */
async function runBlogCrudTest() {
  console.log('--- Blog Service: CRUD Actions (CURRENT only) ---');
  const { apiCurrent, testUser, testPass } = createTestClients();

  logCurrentSection('[CURRENT API Test] createNews / updateNews / deleteNews');
  await apiCurrent.auth.login(testUser, testPass);

  let createdId: number | undefined;

  // ── 1. CREATE ───────────────────────────────────────────
  console.log('\n[1/5] Haber oluştur...');
  const createResult = await apiCurrent.blog.createNews({
    title: '[TEST] Armoyu Core V2 Blog Testi',
    content: 'Bu haber armoyu-core V2 entegrasyon testi tarafından oluşturulmuştur.',
    status: 'publish',
    category: 1
  });
  if (createResult.durum === 1 && createResult.icerik?.id) {
    createdId = createResult.icerik.id;
    logCurrentSuccess(`Haber oluşturuldu! ID: ${createdId} — "${createResult.icerik.title}"`);
  } else {
    logCurrentError('Haber oluşturma başarısız', createResult.aciklama);
    return;
  }

  // ── 2. DETAIL ───────────────────────────────────────────
  console.log('\n[2/5] Haberi getir...');
  const detailResult = await apiCurrent.blog.getNewsDetail({ newsId: createdId });
  if (detailResult.durum === 1 && detailResult.icerik) {
    logCurrentSuccess(`Haber getirildi: "${detailResult.icerik.title}" (${detailResult.icerik.category})`);
  } else {
    logCurrentError('Haber getirme başarısız', detailResult.aciklama);
  }

  // ── 3. UPDATE ───────────────────────────────────────────
  console.log('\n[3/5] Haberi güncelle...');
  const updateResult = await apiCurrent.blog.updateNews(createdId, {
    title: '[TEST] Güncellendi — Armoyu Core V2 Blog Testi',
    content: 'Güncellendi.',
    status: 'publish'
  });
  if (updateResult.durum === 1) {
    logCurrentSuccess(`Haber güncellendi: ${updateResult.aciklama}`);
  } else {
    logCurrentError('Haber güncelleme başarısız', updateResult.aciklama);
  }

  // ── 4. DETAIL (güncelleme doğrula) ──────────────────────
  console.log('\n[4/5] Güncellemeyi doğrula...');
  const detailResult2 = await apiCurrent.blog.getNewsDetail({ newsId: createdId });
  if (detailResult2.durum === 1 && detailResult2.icerik) {
    logCurrentSuccess(`Güncel başlık: "${detailResult2.icerik.title}"`);
  } else {
    logCurrentError('Güncel haber getirme başarısız', detailResult2.aciklama);
  }

  // ── 5. DELETE ───────────────────────────────────────────
  console.log('\n[5/5] Haberi sil...');
  const deleteResult = await apiCurrent.blog.deleteNews(createdId);
  if (deleteResult.durum === 1) {
    logCurrentSuccess(`Haber silindi: ${deleteResult.aciklama}`);
  } else {
    logCurrentError('Haber silme başarısız', deleteResult.aciklama);
  }

  console.log('\nTest tamamlandı.');
}

runBlogCrudTest();

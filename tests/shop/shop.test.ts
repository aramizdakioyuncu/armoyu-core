import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const SHOP_ID = Number(process.env.ARMOYU_TEST_SHOP_ID || '1');

async function runShopTest() {
  console.log('--- Shop Service (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // --- OLD (V1) getProducts ---
  console.log();
  logOldSection('[OLD API Test] getProducts');
  try {
    await apiOld.auth.login(testUser, testPass);
    const result = await apiOld.shop.getProducts(1, { limit: 5 });
    if (result.durum === 1) {
      logOldSuccess(`Products fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(p =>
        console.log(`\x1b[36m  #${p.id} — ${p.name} | ${p.formattedPrice}\x1b[0m`)
      );
    } else {
      logOldError('getProducts returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getProducts failed', err);
  }

  // --- CURRENT (V2) getShops ---
  console.log();
  logCurrentSection('[CURRENT API Test] getShops');
  try {
    await apiCurrent.auth.login(testUser, testPass);
    const result = await apiCurrent.shop.getShops(1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Shops fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 3).forEach(s =>
        console.log(`\x1b[33m  #${s.id} — ${s.name} | products: ${s.productCount} | "${s.description}"\x1b[0m`)
      );
    } else {
      logCurrentError('getShops returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getShops failed', err);
  }

  // --- CURRENT (V2) getShop (detail with products) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getShop (id: ${SHOP_ID})`);
  try {
    const result = await apiCurrent.shop.getShop(SHOP_ID);
    if (result.durum === 1) {
      const s = result.icerik!;
      logCurrentSuccess(`Shop: #${s.id} — ${s.name} | products: ${s.products?.length ?? 0}`);
      s.products?.slice(0, 2).forEach(p =>
        console.log(`\x1b[33m    product #${p.id} — ${p.name} | ${p.price}₺ | category: ${p.category?.name}\x1b[0m`)
      );
    } else {
      logCurrentError('getShop returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getShop failed', err);
  }

  // --- CURRENT (V2) updateShop ---
  console.log();
  logCurrentSection(`[CURRENT API Test] updateShop (id: ${SHOP_ID})`);
  try {
    const result = await apiCurrent.shop.updateShop(SHOP_ID, {});
    if (result.durum === 1) {
      logCurrentSuccess(`Shop #${SHOP_ID} updated.`);
    } else {
      logCurrentError('updateShop returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT updateShop failed', err);
  }

  // --- CURRENT (V2) getShopProducts ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getShopProducts (shopId: ${SHOP_ID})`);
  try {
    const result = await apiCurrent.shop.getShopProducts(SHOP_ID, 1, 10);
    if (result.durum === 1) {
      logCurrentSuccess(`Shop products fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(p =>
        console.log(`\x1b[33m  #${p.id} — ${p.name} | ${p.price}₺ | category: ${p.category?.name}\x1b[0m`)
      );
    } else {
      logCurrentError('getShopProducts returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getShopProducts failed', err);
  }

  // --- CURRENT (V2) createProduct → getProduct → deleteProduct ---
  console.log();
  logCurrentSection('[CURRENT API Test] createProduct');
  let createdProductId: number | undefined;
  try {
    const result = await apiCurrent.shop.createProduct({
      name: '[test] armoyu-core-product',
      price: 1,
      url: 'armoyu-core-test-product'
    });
    if (result.durum === 1) {
      createdProductId = result.icerik?.id;
      logCurrentSuccess(`Product created! id: ${createdProductId} — ${result.icerik?.name} | ${result.icerik?.price}₺`);
    } else {
      logCurrentError('createProduct returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT createProduct failed', err);
  }

  if (createdProductId !== undefined) {
    console.log();
    logCurrentSection(`[CURRENT API Test] getProduct (id: ${createdProductId})`);
    try {
      const result = await apiCurrent.shop.getProduct(createdProductId);
      if (result.durum === 1) {
        const p = result.icerik!;
        logCurrentSuccess(`Product detail: #${p.id} — ${p.name} | ${p.price}₺`);
      } else {
        logCurrentError('getProduct returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT getProduct failed', err);
    }

    console.log();
    logCurrentSection(`[CURRENT API Test] deleteProduct (id: ${createdProductId})`);
    try {
      const result = await apiCurrent.shop.deleteProduct(createdProductId);
      if (result.durum === 1) {
        logCurrentSuccess(`Product #${createdProductId} deleted.`);
      } else {
        logCurrentError('deleteProduct returned durum=0', result.aciklama);
      }
    } catch (err: any) {
      logCurrentError('CURRENT deleteProduct failed', err);
    }
  }
}

runShopTest();

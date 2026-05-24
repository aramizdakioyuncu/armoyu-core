import {
  createTestClients,
  logOldSection, logOldSuccess, logOldError,
  logCurrentSection, logCurrentSuccess, logCurrentError
} from '../shared/test-helper';

const INVOICE_ID = Number(process.env.ARMOYU_TEST_INVOICE_ID || '36');

async function runPaymentInvoicesTest() {
  console.log('--- Payment Service: Invoices (OLD & CURRENT) ---');
  const { apiOld, apiCurrent, testUser, testPass } = createTestClients();

  // Payment endpoints require a user with billing permissions.
  // Set ARMOYU_TEST_PAYMENT_USERNAME / ARMOYU_TEST_PAYMENT_PASSWORD in .env
  // to override the default test user.
  const payUser = process.env.ARMOYU_TEST_PAYMENT_USERNAME || testUser;
  const payPass = process.env.ARMOYU_TEST_PAYMENT_PASSWORD || testPass;

  // --- OLD (V1) getInvoices ---
  console.log();
  logOldSection('[OLD API Test] getInvoices');
  try {
    await apiOld.auth.login(payUser, payPass);
    const result = await apiOld.payments.getInvoices(1);
    if (result.durum === 1) {
      logOldSuccess(`Invoices fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(inv =>
        console.log(`\x1b[36m  #${inv.id} "${inv.name}" — total: ${inv.total} | status: ${inv.status}\x1b[0m`)
      );
    } else {
      logOldError('getInvoices returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logOldError('OLD getInvoices failed', err);
  }

  // --- CURRENT (V2) getInvoices ---
  console.log();
  logCurrentSection('[CURRENT API Test] getInvoices');
  try {
    await apiCurrent.auth.login(payUser, payPass);
    const result = await apiCurrent.payments.getInvoices(1);
    if (result.durum === 1) {
      logCurrentSuccess(`Invoices fetched! Count: ${result.icerik?.length}`);
      result.icerik?.slice(0, 2).forEach(inv =>
        console.log(`\x1b[33m  #${inv.id} "${inv.name}" — price: ${inv.price} + vat: ${inv.vat} = total: ${inv.total} | owner: ${inv.owner.username}\x1b[0m`)
      );
    } else {
      logCurrentError('getInvoices returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getInvoices failed', err);
  }

  // --- CURRENT (V2) getInvoice (detail) ---
  console.log();
  logCurrentSection(`[CURRENT API Test] getInvoice (id: ${INVOICE_ID})`);
  try {
    const result = await apiCurrent.payments.getInvoice(INVOICE_ID);
    if (result.durum === 1) {
      const inv = result.icerik!;
      logCurrentSuccess(`Invoice detail: #${inv.id} "${inv.name}" — total: ${inv.total} | items: ${inv.items?.length ?? 0}`);
      inv.items?.forEach(item =>
        console.log(`\x1b[33m    - ${item.productName} x${item.quantity} @ ${item.unitPrice}\x1b[0m`)
      );
    } else {
      logCurrentError('getInvoice returned durum=0', result.aciklama);
    }
  } catch (err: any) {
    logCurrentError('CURRENT getInvoice failed', err);
  }
}

runPaymentInvoicesTest();

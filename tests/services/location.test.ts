import { createTestApi, logSuccess, logError } from '../shared/test-helper';

const COUNTRY_ID = Number(process.env.ARMOYU_TEST_COUNTRY_ID || '212');
const PROVINCE_ID = Number(process.env.ARMOYU_TEST_PROVINCE_ID || '1');

async function runLocationTest() {
  console.log('--- Location Service Test ---');
  const { api } = createTestApi();

  try {
    const countries = await api.locations.getCountries(1, 10);
    if (countries.durum === 1) {
      logSuccess(`Countries fetched! Count: ${countries.icerik?.length}`);
      if (countries.icerik?.[0]) console.log(`  First: ${countries.icerik[0].name} (${countries.icerik[0].code})`);
    } else {
      logError('getCountries returned durum=0', countries.aciklama);
    }
  } catch (err: any) {
    logError('getCountries failed', err);
  }

  try {
    const provinces = await api.locations.getProvinces(1, COUNTRY_ID, 10);
    if (provinces.durum === 1) {
      logSuccess(`Provinces fetched! Count: ${provinces.icerik?.length}`);
      if (provinces.icerik?.[0]) console.log(`  First: ${provinces.icerik[0].name}`);
    } else {
      logError('getProvinces returned durum=0', provinces.aciklama);
    }
  } catch (err: any) {
    logError('getProvinces failed', err);
  }

  try {
    const counties = await api.locations.getCounties(1, PROVINCE_ID, 10);
    if (counties.durum === 1) {
      logSuccess(`Counties fetched! Count: ${counties.icerik?.length}`);
      if (counties.icerik?.[0]) console.log(`  First: ${counties.icerik[0].name}`);
    } else {
      logError('getCounties returned durum=0', counties.aciklama);
    }
  } catch (err: any) {
    logError('getCounties failed', err);
  }
}

runLocationTest();

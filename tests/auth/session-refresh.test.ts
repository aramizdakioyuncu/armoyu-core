import assert from 'node:assert/strict';
import { ApiClient, ApiVersion } from '../../src/api/ApiClient';

const json = (body: unknown, status: number) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const refreshed = () => json({ durum: 1, aciklamadetay: { accessToken: 'new-access', refreshToken: 'new-refresh' } }, 200);

async function scenario(refreshResponse: (() => Response) | null, run: (client: ApiClient) => Promise<unknown>, version: ApiVersion = ApiVersion.CURRENT) {
  const calls = { refresh: 0, expired: 0, refreshed: 0 };
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    if (String(url).endsWith('/v1/auth/refresh')) {
      calls.refresh++;
      if (!refreshResponse) throw new TypeError('network down');
      await new Promise((resolve) => setTimeout(resolve, 5));
      return refreshResponse();
    }
    const auth = new Headers(init.headers).get('Authorization');
    return auth === 'Bearer new-access' ? json({ durum: 1, icerik: 'ok' }, 200) : json({ durum: 0 }, 401);
  }) as typeof fetch;

  const client = new ApiClient({ baseUrl: 'http://api.test', token: 'old-access', refreshToken: 'old-refresh', version, usePreviousVersion: version === ApiVersion.OLD });
  client.setSessionHandlers({ onExpired: () => { calls.expired++; }, onRefreshed: () => { calls.refreshed++; } });
  const result = await run(client).catch((e) => e);
  return { ...calls, result, client };
}

async function main() {
// Süresi dolan token sessizce yenilenir ve istek tekrarlanır
let r = await scenario(refreshed, (c) => c.get<any>('/v1/social'));
assert.equal((r.result as any).icerik, 'ok');
assert.deepEqual([r.refresh, r.refreshed, r.expired], [1, 1, 0]);

// Eşzamanlı istekler tek refresh kullanır (refresh token tek kullanımlık)
r = await scenario(refreshed, (c) => Promise.all([c.get('/v1/a'), c.get('/v1/b'), c.get('/v1/c')]));
assert.equal(r.refresh, 1);
assert.equal(r.expired, 0);

// Refresh reddedilirse oturum biter
r = await scenario(() => json({ durum: 0 }, 401), (c) => c.get('/v1/social'));
assert.deepEqual([r.expired, r.client.getAuthToken()], [1, null]);

// Ağ hatası, sunucu hatası ve başka sekmenin yenilemesi oturumu kapatmaz
for (const response of [null, () => json({ durum: 0 }, 503), () => json({ durum: 0 }, 409)]) {
  r = await scenario(response, (c) => c.get('/v1/social'));
  assert.equal(r.expired, 0);
  assert.equal(r.client.getAuthToken(), 'old-access');
}

// Yanlış şifrenin 401'i yenileme denemesine yol açmaz
r = await scenario(refreshed, (c) => c.post('/v1/auth/login', {}));
assert.deepEqual([r.refresh, r.expired], [0, 0]);

// Eski API'de 401 yenileme de çıkış da tetiklemez
r = await scenario(refreshed, (c) => c.get('/0/0/liste/'), ApiVersion.OLD);
assert.deepEqual([r.refresh, r.expired], [0, 0]);
assert.equal(r.client.getAuthToken(), 'old-access');

console.log('session-refresh OK');
}

main();

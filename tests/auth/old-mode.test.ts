import assert from 'node:assert/strict';
import { ARMOYUCore } from '../../src/api/ARMOYUCore';
import { ApiVersion } from '../../src/api/ApiClient';

async function main() {
  const urls: string[] = [];
  const headers: Headers[] = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    urls.push(String(url));
    headers.push(new Headers(init.headers));
    return new Response(JSON.stringify({ durum: 1, aciklama: 'ok', icerik: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;

  const logger = { info() {}, warn() {}, error() {}, debug() {} } as any;
  const old = new ARMOYUCore(ApiVersion.OLD, 'eski-anahtar', { baseUrl: 'http://eski.test', token: 'jeton', logger });
  assert.equal(old.version, ApiVersion.OLD);

  await old.auth.login('oyuncu', 'sifre');
  await old.social.getPosts(1, 10);
  await old.stories.getStories();

  assert.ok(urls.every((u) => u.startsWith('http://eski.test/botlar/eski-anahtar/0/0/') || u.includes('/botlar/eski-anahtar/')), urls.join(' '));
  assert.ok(urls.every((u) => !u.includes('/v1/')), 'Eski mod /v1 çağırmamalı');
  assert.equal(headers[0].get('X-API-KEY'), 'eski-anahtar');

  urls.length = 0;
  const current = new ARMOYUCore(ApiVersion.CURRENT, 'yeni-anahtar', { baseUrl: 'http://yeni.test', token: 'jeton', logger });
  await current.social.getPosts(1, 10);
  assert.ok(urls[0].startsWith('http://yeni.test/v1/social'), urls[0]);

  console.log('old-mode OK');
}

main();

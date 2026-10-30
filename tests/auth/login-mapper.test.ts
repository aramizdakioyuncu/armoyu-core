import assert from 'node:assert/strict';
import { AuthMapperV2 } from '../../src/utils/mappersv2/AuthMapperV2';
import { PostMapper } from '../../src/utils/mappers/social/PostMapper';

const uuid = '0f0e4b52-6f7a-4c1d-9a3e-2b1c8d7e6f50';

const login = AuthMapperV2.mapLogin({
  durum: 1,
  aciklamadetay: { accessToken: 'token', refreshToken: 'refresh' },
  icerik: { expiresIn: 900, user: { id: uuid, username: 'oyuncu', displayName: 'Oyuncu Bir', avatar: '' } },
});

assert.equal(login.token, 'token');
assert.equal(login.user.id, uuid, 'UUID sayıya çevrilmemeli');
assert.equal(login.user.username, 'oyuncu');

const legacy = AuthMapperV2.mapLogin({ durum: 1, aciklamadetay: { accessToken: 'token' }, icerik: { user: { id: '42' } } });
assert.equal(legacy.user.id, 42, 'Sayısal id sayı kalmalı');

console.log('login-mapper OK');

const post = PostMapper.mapFeedPostV2({
  post_ID: uuid,
  owner: { owner_ID: uuid, username: 'oyuncu', displayname: 'Oyuncu Bir' },
  content: 'merhaba',
  like_count: 2,
  liked_by_me: 1,
  first_likers: [{ like_ID: uuid, user_ID: uuid, username: 'oyuncu', displayname: 'Oyuncu Bir' }],
  first_comments: [{ post_ID: uuid, comment_ID: uuid, user_ID: uuid, content: 'selam', username: 'oyuncu' }],
});

assert.equal(post.id, uuid, 'Paylaşım UUID kalmalı');
assert.equal(post.owner?.id, uuid, 'Sahip UUID kalmalı');
assert.equal(post.topLikers?.[0]?.id, uuid, 'Beğenen UUID kalmalı');
assert.equal(post.topComments?.[0]?.id, uuid, 'Yorum UUID kalmalı');

console.log('post-mapper OK');

import { ArmoyuApi } from '../src/api/ArmoyuApi';
import * as fs from 'fs';

/**
 * Interface Discovery Script
 * Run with: npx tsx scripts/discovery.ts
 */
async function discover() {
  const apiKey = process.env.NEXT_PUBLIC_ARMOYU_API_KEY || process.env.ARMOYU_API_KEY;
  const token = process.env.NEXT_PUBLIC_ARMOYU_TOKEN || process.env.ARMOYU_TOKEN;

  if (!apiKey) {
    console.error('ERROR: API Key not found in environment.');
    return;
  }

  const api = new ArmoyuApi(apiKey, {
    baseUrl: 'https://api.aramizdakioyuncu.com',
    token: token || null
  });

  const results: Record<string, any> = {};

  console.log('--- Starting Discovery Phase 1 ---');

  // 1. Auth Me
  try {
    console.log('[Auth] Fetching me...');
    const me = await api.auth.me();
    results['auth_me'] = me;
  } catch (e) { console.error('[Auth] me failed'); }

  // 2. XP Rankings
  try {
    console.log('[User] Fetching XP Rankings...');
    const xp = await api.users.getXpRankings(1);
    results['user_xp_rankings'] = xp;
  } catch (e) { console.error('[User] xp rankings failed'); }

  // 3. User Search
  try {
    console.log('[User] Searching for "berkay"...');
    const userSearch = await api.users.search('berkay');
    results['user_search'] = userSearch;
  } catch (e) { console.error('[User] search failed'); }

  // 4. Global Search

  // 4. Social Feed
  try {
    console.log('[Social] Fetching posts...');
    const posts = await api.social.getPosts(1);
    results['social_posts'] = posts;
  } catch (e) { console.error('[Social] posts failed'); }

  // 6. Comments (Use a real postId from discovery if possible)
  try {
    const postId = results['social_posts']?.icerik?.[0]?.paylasimID || 3326;
    console.log(`[Social] Fetching comments for post ${postId}...`);
    const comments = await api.social.getComments(postId);
    results['social_comments'] = comments;
  } catch (e) { console.error('[Social] comments failed'); }

  // 7. Group List
  try {
    console.log('[Community] Fetching groups...');
    const groups = await api.groups.getGroups(1);
    results['community_groups'] = groups;
  } catch (e) { console.error('[Community] groups failed'); }

  // 8. Trying Blog on api.armoyu.com
  try {
    console.log('[Blog] Fetching news from api.armoyu.com...');
    const backupApi = new ArmoyuApi(apiKey, { baseUrl: 'https://api.armoyu.com', token: token || null });
    const news = await backupApi.blog.getNews(1);
    results['blog_news_fallback'] = news;
  } catch (e) { console.error('[Blog] news fallback failed'); }

  // 3. User Search (Retry on api.armoyu.com)
  try {
    console.log('[User] Searching for "berkay" on api.armoyu.com...');
    const backupApi = new ArmoyuApi(apiKey, { baseUrl: 'https://api.armoyu.com', token: token || null });
    const userSearch = await backupApi.users.search('berkay');
    results['user_search_fallback'] = userSearch;
  } catch (e) { console.error('[User] search fallback failed'); }

  // 9. Events
  try {
    console.log('[Community] Fetching events...');
    const events = await api.events.getEvents(1);
    results['community_events'] = events;
  } catch (e) { console.error('[Community] events failed'); }

  // 10. Forum Categories
  try {
    console.log('[Community] Fetching forum categories...');
    const forumCats = await api.forum.getCategories();
    results['community_forums'] = forumCats;
  } catch (e) { console.error('[Community] forums failed'); }

  // 11. Trying Blog with POST just in case
  try {
    console.log('[Blog] Fetching news with POST (test)...');
    const response = await (api as any).client.post( (api.blog as any).resolveBotPath('/haberler/0/0/0/'), new FormData());
    results['blog_news_post_test'] = response;
  } catch (e) { console.error('[Blog] news POST test failed'); }

  // 12. Legacy News
  try {
    console.log('[Blog] Fetching legacy news...');
    const legacyNews = await api.blog.getNewsLegacy(1);
    results['blog_news_legacy'] = legacyNews;
  } catch (e) { console.error('[Blog] legacy news failed'); }

  // 13. Friends List
  try {
    console.log('[User] Fetching friends list...');
    const friends = await api.users.getFriendsList(1);
    results['user_friends'] = friends;
  } catch (e) { console.error('[User] friends failed'); }

  // 14. Media List
  try {
    console.log('[User] Fetching media list...');
    const media = await api.users.getUserMedia(1);
    results['user_media'] = media;
  } catch (e) { console.error('[User] media failed'); }

  // 15. Stories
  try {
    console.log('[Social] Fetching stories...');
    const stories = await api.stories.getStories(1);
    results['social_stories'] = stories;
  } catch (e) { console.error('[Social] stories failed'); }

  // Save results to a file for analysis
  if (!fs.existsSync('./discovery')) {
    fs.mkdirSync('./discovery');
  }
  
  fs.writeFileSync('./discovery/phase1.json', JSON.stringify(results, null, 2));
  console.log('--- Discovery Phase 1 Completed! Results saved to ./discovery/phase1.json ---');
}

discover();

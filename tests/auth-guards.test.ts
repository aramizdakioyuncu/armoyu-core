import { ArmoyuApi } from '../src/api/ArmoyuApi';

/**
 * Authentication Guards Test
 * Verifies that sensitive methods are protected and public methods are accessible.
 * 
 * Run with: npx tsx tests/auth-guards.test.ts
 */
async function runTests() {
    console.log('--- ARMOYU CORE AUTH GUARDS TEST ---');
    
    // We use a dummy key for testing guard logic
    const api = new ArmoyuApi('test_key');

    const results = {
        passed: 0,
        failed: 0,
        guarded: 0
    };

    const testGuard = async (serviceName: string, methodName: string, call: () => Promise<any>) => {
        try {
            await call();
            console.log(`[FAILED] ${serviceName}.${methodName} should be guarded but didn't throw!`);
            results.failed++;
        } catch (error: any) {
            if (error.message === 'Bu işlem için giriş yapmalısınız.') {
                console.log(`[PASSED] ${serviceName}.${methodName} is correctly guarded.`);
                results.guarded++;
                results.passed++;
            } else {
                console.log(`[ERROR] ${serviceName}.${methodName} threw unexpected error:`, error.message);
                results.failed++;
            }
        }
    };

    const testPublic = async (serviceName: string, methodName: string, call: () => Promise<any>) => {
        try {
            await call();
            console.log(`[PASSED] ${serviceName}.${methodName} (Public) executed.`);
            results.passed++;
        } catch (error: any) {
            // Public methods might fail due to invalid key, but they shouldn't be blocked by the internal auth guard
            if (error.message === 'Bu işlem için giriş yapmalısınız.') {
                console.log(`[FAILED] ${serviceName}.${methodName} (Public) was blocked by auth guard!`);
                results.failed++;
            } else {
                console.log(`[PASSED] ${serviceName}.${methodName} (Public) bypassed internal guard (API Error: ${error.message.substring(0, 50)}...)`);
                results.passed++;
            }
        }
    };

    console.log('\n--- Testing Guards ---');
    
    // Social
    await testGuard('social', 'createPost', () => api.social.createPost('test content'));
    await testGuard('social', 'addLike', () => api.social.addLike({ postId: 1 }));

    // Users
    await testGuard('users', 'updateProfile', () => api.users.updateProfile({}));
    await testGuard('users', 'addFriend', () => api.users.addFriend(1));

    // Chat
    await testGuard('chat', 'sendMessage', () => api.chat.sendMessage({ userId: 1, content: 'hi' }));

    // Groups
    await testGuard('groups', 'inviteToGroup', () => api.groups.inviteToGroup(1, [1]));

    // Polls
    await testGuard('polls', 'createPoll', () => api.polls.createPoll({ question: '?', options: [], endDate: '' }));

    // Blocks
    await testGuard('blocks', 'blockUser', () => api.blocks.blockUser(1));

    // Stories
    await testGuard('stories', 'addStory', () => api.stories.addStory('url'));

    // Support
    await testGuard('support', 'createTicket', () => api.support.createTicket('sub', 'msg', 'cat'));

    console.log('\n--- Testing Public Methods ---');
    // Social
    await testPublic('social', 'getPosts', () => api.social.getPosts(1));
    
    // Users
    await testPublic('users', 'getXpRankings', () => api.users.getXpRankings(1));
    await testPublic('users', 'getPopRankings', () => api.users.getPopRankings(1));

    // Blog
    await testPublic('blog', 'getNews', () => api.blog.getNews(1));

    console.log('\n--- TEST SUMMARY ---');
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`Passed: ${results.passed} (Guarded Correctly: ${results.guarded})`);
    console.log(`Failed: ${results.failed}`);

    if (results.failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});

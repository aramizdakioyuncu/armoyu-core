import { createTestClients, logSuccess, logError, logCurrentSection } from '../shared/test-helper';
import { PasswordResetPreference } from '../../src/models';

async function runPasswordTest() {
  console.log('--- Auth Password Reset Test ---');
  const { apiCurrent, testUser } = createTestClients();

  logCurrentSection('[CURRENT API Password Reset Test]');
  try {
    // 1. Test V2 forgotPassword
    console.log("Testing CURRENT forgotPassword...");
    const forgotResult = await apiCurrent.auth.forgotPassword({
      username: testUser,
      email: "yonetimekibi@aramizdakioyuncu.com",
      birthday: "01.01.2002",
      preference: PasswordResetPreference.EMAIL
    });
    if (forgotResult.durum === 1) {
      logSuccess(`CURRENT forgotPassword successful: ${forgotResult.aciklama}`);
    } else {
      logError(`CURRENT forgotPassword failed: ${forgotResult.aciklama}`);
    }

    // 2. Test V2 verifyPasswordReset (with fake code to verify route and params)
    console.log("\nTesting CURRENT verifyPasswordReset (with fake code)...");
    const resetResult = await apiCurrent.auth.verifyPasswordReset({
      username: testUser,
      email: "yonetimekibi@aramizdakioyuncu.com",
      birthday: "01.01.2002",
      code: "123456",
      newPassword: "newpassword123"
    });
    // Should fail with validation/incorrect code, but not connection/syntax error
    if (resetResult.durum === 1) {
      logSuccess(`CURRENT verifyPasswordReset successful: ${resetResult.aciklama}`);
    } else {
      logSuccess(`CURRENT verifyPasswordReset correctly processed (failed as expected): ${resetResult.aciklama}`);
    }
  } catch (err: any) {
    logError('Password reset test failed', err);
  }
}

runPasswordTest();

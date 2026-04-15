import { Group } from '../src/models/community/Group';

/**
 * Test case for the specific nested structure reported by the user:
 * Group_URL -> group_logo -> media_minURL
 */

const mockApiResponse = {
  grup_ID: "123",
  grup_ad: "Test Grubu",
  Group_URL: {
    url: "test-grubu",
    group_logo: {
      media_minURL: "https://media.armoyu.com/logo/test_min.png",
      media_URL: "https://media.armoyu.com/logo/test.png"
    }
  }
};

console.log('Testing Group.fromJSON with nested structure...');

const group = Group.fromJSON(mockApiResponse);

console.log('--- Results ---');
console.log('ID:', group.id);
console.log('Name:', group.name);
console.log('Slug:', group.slug);
console.log('Logo:', group.logo);

const expectedLogo = "https://media.armoyu.com/logo/test_min.png";
const expectedSlug = "test-grubu";

if (group.logo === expectedLogo && group.slug === expectedSlug) {
  console.log('\n✅ TEST PASSED: Logo and Slug correctly extracted from group_URL object.');
} else {
  console.log('\n❌ TEST FAILED:');
  if (group.logo !== expectedLogo) console.log(`Expected Logo: ${expectedLogo}, Got: ${group.logo}`);
  if (group.slug !== expectedSlug) console.log(`Expected Slug: ${expectedSlug}, Got: ${group.slug}`);
  process.exit(1);
}

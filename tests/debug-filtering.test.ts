import { PostService } from '../src/services/social/PostService';
import { ApiClient } from '../src/api/ApiClient';
import { ArmoyuLogger, ConsoleLogger } from '../src/api/Logger';

async function testFiltering() {
  const apiKey = '5121eab7d46f1120f9527393ea19a0e9';
  const token = '5221d07eb0049191ed17b3d1ea773941aa3ab1960c9696c64de2281766d13df2';
  
  const client = new ApiClient({ baseUrl: 'https://api.aramizdakioyuncu.com' });
  client.setApiKey(apiKey);
  client.setToken(token);
  
  const logger = new ConsoleLogger();
  const postService = new PostService(client, logger);

  console.log('\n--- TESTING PLAYER FILTER (Exclusive Mapping) ---');
  // Use the username from the curl: berkaytikenoglu
  const response = await postService.getPosts(1, { 
    category: 'oyuncu', 
    categoryDetail: 'berkaytikenoglu' 
  });

  if (response.durum === 1) {
    console.log(`Success! Found ${response.icerik.length} posts.`);
  } else {
    console.log('Error:', response.aciklama);
  }

  console.log('\n--- TESTING USER ID FILTER (oyuncubakid) ---');
  const responseId = await postService.getPosts(1, { 
    userId: 11107 
  });
  if (responseId.durum === 1) {
    console.log(`Success! Found ${responseId.icerik.length} posts for ID 11107.`);
  }

  console.log('\n--- TESTING FEATURE FILTER (paylasimozellik) ---');
  const responseFeature = await postService.getPosts(1, { 
    feature: 'etiketlenmis' 
  });
  if (responseFeature.durum === 1) {
    console.log(`Success! Found ${responseFeature.icerik.length} tagged posts.`);
  }
}

testFiltering().catch(err => console.error('Test failed:', err));

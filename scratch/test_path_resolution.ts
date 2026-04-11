import { ApiClient } from '../src/api/ApiClient';
import { ConsoleLogger } from '../src/api/Logger';

// Mock service for testing
class TestService {
  constructor(private client: ApiClient) {}
  
  resolveBotPath(path: string): string {
    const apiKey = (this.client as any).config.apiKey;
    const baseUrl = (this.client as any).config.baseUrl;
    
    if (apiKey && path.startsWith('/0/') && !path.includes('/botlar/') && !baseUrl.includes('/botlar/')) {
      return `/botlar/${apiKey}${path}`;
    }
    return path;
  }
}

async function testPathResolution() {
  const apiKey = 'test_key';
  
  // Case 1: Root baseUrl
  const client1 = new ApiClient({ baseUrl: 'https://api.test.com', apiKey });
  const service1 = new TestService(client1);
  const path1 = service1.resolveBotPath('/0/0/arama/0/0/');
  console.log('Case 1 (Root):', path1);
  // Expected: /botlar/test_key/0/0/arama/0/0/

  // Case 2: Botlar baseUrl
  const client2 = new ApiClient({ baseUrl: 'https://api.test.com/botlar/test_key', apiKey });
  const service2 = new TestService(client2);
  const path2 = service2.resolveBotPath('/0/0/arama/0/0/');
  console.log('Case 2 (Botlar):', path2);
  // Expected: /0/0/arama/0/0/
}

testPathResolution();

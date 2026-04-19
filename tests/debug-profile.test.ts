import { ApiClient } from '../src/api/ApiClient';
import { UserProfileService } from '../src/services/user/UserProfileService';
import { ConsoleLogger } from '../src/api/Logger';

async function main() {
    const client = new ApiClient({
        baseUrl: 'https://service.armoyu.com/botlar/armoyu_showcase_key',
    });
    
    const logger = new ConsoleLogger();
    const service = new UserProfileService(client, logger);
    
    try {
        console.log("--- TESTING USER PROFILE ---");
        const result = await service.getUserByUsername('berkaytikenoglu');
        console.log("Status:", result.durum);
        console.log("Description:", result.aciklama);
        console.log("Data (Truncated):", JSON.stringify(result.icerik).substring(0, 1000));
        
        if (result.icerik) {
            console.log("\nKeys at root:", Object.keys(result.icerik));
            if ((result.icerik as any).oyuncu_bilgi) {
                console.log("Found oyuncu_bilgi:", Object.keys((result.icerik as any).oyuncu_bilgi));
            }
            if ((result.icerik as any).detailInfo) {
                console.log("Found detailInfo:", Object.keys((result.icerik as any).detailInfo));
            }
        }
    } catch (e) {
        console.error(e);
    }
}

main();

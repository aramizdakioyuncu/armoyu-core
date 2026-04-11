const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. CONFIG update
const oldEntry = '{ id: "updateNotificationSettings", name: "Update Notification Settings", method: "POST", endpoint: "/deneme/deneme/bildirimler/ayarlar/0/", inputs: ["notificationSettings"], desc: "Update alerts (e.g. key=value)", auth: true }';
const newEntry = oldEntry + ',\n      { id: "getXpRankings", name: "XP Rankings", method: "POST", endpoint: "/0/0/xpsiralama/0/0/", inputs: ["sayfa"], desc: "View experience leaderboard", auth: true },\n      { id: "getPopRankings", name: "Popularity Rankings", method: "POST", endpoint: "/0/0/popsiralama/0/0/", inputs: ["sayfa"], desc: "View popularity leaderboard", auth: true }';

if (content.includes(oldEntry)) {
    content = content.replace(oldEntry, newEntry);
    console.log('Config updated');
} else {
    console.log('Config entry not found');
}

// 2. handleExecute update
const oldExec = `          result = await api.users.updateNotificationSettings(settings);
        }
      } else if (activeService === 'rules') {`;

const newExec = `          result = await api.users.updateNotificationSettings(settings);
        } else if (action.id === 'getXpRankings') {
          result = await api.users.getXpRankings(inputs.sayfa ? Number(inputs.sayfa) : 1);
        } else if (action.id === 'getPopRankings') {
          result = await api.users.getPopRankings(inputs.sayfa ? Number(inputs.sayfa) : 1);
        }
      } else if (activeService === 'rules') {`;

if (content.includes(oldExec)) {
    content = content.replace(oldExec, newExec);
    console.log('Execute logic updated');
} else {
    // Try with normalized line endings
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const normalizedOldExec = oldExec.replace(/\r\n/g, '\n');
    if (normalizedContent.includes(normalizedOldExec)) {
        content = normalizedContent.replace(normalizedOldExec, newExec.replace(/\r\n/g, '\n'));
        console.log('Execute logic updated (normalized)');
    } else {
        console.log('Target not found');
    }
}

// 3. Final purge of ALL non-ASCII characters
content = content.split('\n').map(line => line.replace(/[^\x20-\x7E\s]/g, '')).join('\n');

fs.writeFileSync(path, content);
console.log('File cleaned and saved');

const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update handleExecute logic for social
const oldSocialExec = `        } else if (action.id === 'deletePost') {
          result = await api.social.deletePost(inputs.postID);
        }
      } else if (activeService === 'search') {`;

const newSocialExec = `        } else if (action.id === 'deletePost') {
          result = await api.social.deletePost(inputs.postID);
        } else if (action.id === 'getPostLikers') {
          result = await api.social.getPostLikers(inputs.postID);
        }
      } else if (activeService === 'search') {`;

if (content.includes(oldSocialExec)) {
  content = content.replace(oldSocialExec, newSocialExec);
  console.log('Update found and applied');
} else {
  console.log('Target not found');
}

// 2. Global cleanup of ANY weird characters (including the one I won't name)
content = content.split('\n').map(line => line.replace(/[^\x20-\x7E\s]/g, '')).join('\n');

fs.writeFileSync(path, content);
console.log('Dashboard cleaned and saved');

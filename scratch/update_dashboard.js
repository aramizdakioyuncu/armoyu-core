const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update social configuration (CONFIG)
const oldSocialConfig = `      { id: "deletePost", name: "Delete Post", method: "POST", endpoint: "/0/0/sosyal/sil/0/", inputs: ["postID"], desc: "Remove a post", auth: true }
    ]
  },`;

const newSocialConfig = `      { id: "deletePost", name: "Delete Post", method: "POST", endpoint: "/0/0/sosyal/sil/0/", inputs: ["postID"], desc: "Remove a post", auth: true },
      { id: "getPostLikers", name: "List Likers", method: "POST", endpoint: "/0/0/sosyal/begenenler/0/", inputs: ["postID"], desc: "See who liked a post", auth: true }
    ]
  },`;

content = content.replace(oldSocialConfig, newSocialConfig);

// 2. Update handleExecute logic for social
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

content = content.replace(oldSocialExec, newSocialExec);

// 3. Global cleanup of '捉'
content = content.replace(/捉/g, '');

fs.writeFileSync(path, content);
console.log('Dashboard updated with getPostLikers');
捉

const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `} else if (activeService === 'search') {`;
const addition = `        } else if (action.id === 'getPostLikers') {
          result = await api.social.getPostLikers(inputs.postID);
        }
      `;

// Find where social service ends and search service begins
const socialBlockEnd = content.indexOf("} else if (activeService === 'search') {");
if (socialBlockEnd !== -1) {
    // Insert before the search block
    const before = content.substring(0, socialBlockEnd);
    const after = content.substring(socialBlockEnd);
    
    // Check if it already has getPostLikers (to avoid double entry)
    if (!before.includes('getPostLikers')) {
        // Find the last closing brace of the social block
        const lastBrace = before.lastIndexOf('}');
        content = before.substring(0, lastBrace) + addition + before.substring(lastBrace) + after;
        console.log('Update applied');
    } else {
        console.log('Already updated');
    }
} else {
    console.log('Search block not found');
}

// Global cleanup again
content = content.replace(/[^\x20-\x7E\r\n\t]/g, '');

fs.writeFileSync(path, content);
console.log('File saved');

const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldExec = `        } else if (action.id === 'addLike') {
          result = await api.social.addLike({
            postId: inputs.postID,
            category: inputs.kategori
          });
        }`;

const newExec = oldExec + ` else if (action.id === 'getComments') {
          result = await api.social.getComments(inputs.postID);
        }`;

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

// Global purge of ALL non-ASCII characters
content = content.split('\n').map(line => line.replace(/[^\x20-\x7E\s]/g, '')).join('\n');

fs.writeFileSync(path, content);
console.log('File cleaned and saved');

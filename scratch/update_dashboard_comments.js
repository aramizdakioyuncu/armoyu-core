const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. CONFIG update
const oldConfigEntry = '{ id: "addLike", name: "Add Like", method: "POST", endpoint: "/0/0/sosyal/begen/0/", inputs: ["postID", "kategori"], desc: "Express interest", auth: true }';
const newConfigEntry = oldConfigEntry + ',\n      { id: "getComments", name: "List Comments", method: "POST", endpoint: "/0/0/sosyal/yorumlar/0/", inputs: ["postID"], desc: "Fetch comments for a post", auth: true }';

if (content.includes(oldConfigEntry)) {
    content = content.replace(oldConfigEntry, newConfigEntry);
    console.log('Config updated');
} else {
    console.log('Config entry not found');
}

// 2. handleExecute update
const oldExecBlock = `        } else if (action.id === 'addLike') {
          result = await api.social.addLike({
            postId: inputs.postID,
            category: inputs.kategori
          });
        }`;

const newExecBlock = oldExecBlock + ` else if (action.id === 'getComments') {
          result = await api.social.getComments(inputs.postID);
        }`;

if (content.includes(oldExecBlock)) {
    content = content.replace(oldExecBlock, newExecBlock);
    console.log('Execute logic updated');
} else {
    // Try with different line endings just in case
    const oldExecBlockLF = oldExecBlock.replace(/\r\n/g, '\n');
    if (content.includes(oldExecBlockLF)) {
        content = content.replace(oldExecBlockLF, newExecBlock.replace(/\r\n/g, '\n'));
        console.log('Execute logic updated (LF)');
    } else {
        console.log('Execute logic block not found');
    }
}

// 3. Final purge of any non-ASCII characters
content = content.split('\n').map(line => line.replace(/[^\x20-\x7E\s]/g, '')).join('\n');

fs.writeFileSync(path, content);
console.log('File cleaned and saved');
捉

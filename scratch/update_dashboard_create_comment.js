const fs = require('fs');
const path = 'c:/Users/monster-berkaytikeno/web/armoyu-core/examples/console/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. CONFIG update
const oldEntry = '{ id: "getComments", name: "List Comments", method: "POST", endpoint: "/0/0/sosyal/yorumlar/0/", inputs: ["postID"], desc: "Fetch comments for a post", auth: true }';
const newEntry = oldEntry + ',\n      { id: "createComment", name: "Create Comment", method: "POST", endpoint: "/0/0/sosyal/yorum-olustur/0/", inputs: ["postID", "yorumicerik", "kategori", "kimeyanit"], desc: "Post a new comment", auth: true }';

if (content.includes(oldEntry)) {
    content = content.replace(oldEntry, newEntry);
    console.log('Config updated');
} else {
    console.log('Config entry not found');
}

// 2. handleExecute update
const oldExec = `        } else if (action.id === 'getComments') {
          result = await api.social.getComments(inputs.postID);
        }`;

const newExec = oldExec + ` else if (action.id === 'createComment') {
          result = await api.social.createComment({
            postId: inputs.postID,
            content: inputs.yorumicerik,
            category: inputs.kategori,
            replyTo: inputs.kimeyanit
          });
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

// 3. Final purge of ALL non-ASCII characters
content = content.split('\n').map(line => line.replace(/[^\x20-\x7E\s]/g, '')).join('\n');

fs.writeFileSync(path, content);
console.log('File cleaned and saved');
捉

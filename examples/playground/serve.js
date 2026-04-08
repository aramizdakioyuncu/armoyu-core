const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PROXY_BASE = 'api.armoyu.com';
const PROXY_PATH_PREFIX = '/botlar/apikey/0/0/0/0/0';

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
};

const server = http.createServer((req, res) => {
    // 1. Handle Proxy Requests
    if (req.url.startsWith('/proxy/')) {
        // Expected URL: /proxy/{apiKey}/path...
        const parts = req.url.split('/').filter(Boolean); // ["proxy", "{apiKey}", "auth", "login"]
        const apiKey = parts[1] || 'apikey';
        const remainingPath = '/' + parts.slice(2).join('/');
        
        const targetPath = `/botlar/${apiKey}/0/0/0/0/0${remainingPath}`;
        console.log(`[PROXY] ${req.method} -> https://${PROXY_BASE}${targetPath}`);

        const proxyReq = https.request({
            hostname: PROXY_BASE,
            path: targetPath,
            method: req.method,
            headers: {
                ...req.headers,
                host: PROXY_BASE // Override host
            }
        }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        req.pipe(proxyReq);
        proxyReq.on('error', (e) => {
            console.error(e);
            res.writeHead(500);
            res.end('Proxy Error: ' + e.message);
        });
        return;
    }

    // 2. Handle Static Files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(path.join(__dirname, filePath), (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

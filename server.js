const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('404 Not Found');
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Prevent path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    send404(res);
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      send404(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', mime);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => send404(res));
  });
});

server.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}/`);
  console.log('Serving files from', PUBLIC_DIR);
});

module.exports = server;

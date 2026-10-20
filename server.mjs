import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve('.');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml' };
const allowed = new Set(['/index.html', '/styles.css', '/app.js', '/curriculum.js', '/i18n.js', '/music.js']);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const name = pathname === '/' ? '/index.html' : pathname;
    if (!allowed.has(name)) { res.writeHead(404); res.end('Not found'); return; }
    const path = resolve(root, '.' + name);
    if (!path.startsWith(root + sep)) throw new Error('Invalid path');
    const content = await readFile(path);
    res.writeHead(200, { 'Content-Type': `${types[extname(path)]}; charset=utf-8`, 'Cache-Control':'no-cache' });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.env.PORT) || 5173, '127.0.0.1', () => console.log(`Little Keys: http://localhost:${server.address().port}`));

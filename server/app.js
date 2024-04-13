import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');

const config = await new Promise((resolve, reject) => {
  readFile(join(projectDirectory, 'server', 'config.json'), (error, content) => {
    if (error) {
      reject();
      return;
    }
    resolve(JSON.parse(content));
  })
});
config.pages = (() => {
  let pages = {};
  for (let page of config.pages) {
    pages[page] = null;
  }
  return pages;
})();

createServer((request, response) => {
  if (request.url in config.pages) {
    readFile(join(projectDirectory, 'static', 'index.html'), (error, content) => {
      if (error) {
        response.writeHead(500);
        response.end();
        return;
      }
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(content);
    });
    return;
  }
  readFile(join(projectDirectory, 'public', request.url), (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        response.writeHead(302, {
          'Location': '/404'
        });
        response.end();
        return;
      }
      response.writeHead(500);
      response.end();
      return;
    }
    let contentType = 'application/octet-stream';
    switch (extname(request.url)) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
    }
    response.writeHead(200, {
      'Content-Type': contentType
    });
    response.end(content);
  });
}).listen(config.port, config.hostname);

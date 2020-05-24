const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const helmet = require('helmet');

// Security level configurations using the helmet module
// TODO: Finalize on the list of configurations
const helmetConfig = {
  contentSecurityPolicy: false, // Temporary removing this policy
  noCache: false,
  ieNoOpen: false,
  noSniff: false,
  hidePoweredBy: true
};
/**
 * This method checks if the pathname is a static and next server 
 * needs to to serve static assets instead of handling the rendering
 * @param {string} pathname Pathname extracted from req.url
 */
const isStaticAsset = pathname => pathname === '/sw.js' || pathname.startsWith('/workbox-');

app.prepare().then(() => {
  const server = express();

  server
    // Security configurations
    .use(helmet(helmetConfig));

  server.get('/a', (req, res) => {
    return app.render(req, res, '/a', req.query);
  });

  server.get('/b', (req, res) => {
    return app.render(req, res, '/b', req.query);
  });

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
      
    if (isStaticAsset(pathname)) {
      const filePath = join(__dirname, 'build', pathname);
      return app.serveStatic(req, res, filePath);
    } else {
      return handle(req, res);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

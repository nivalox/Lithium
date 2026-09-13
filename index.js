import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';

const port = process.env.PORT || 8080;

const bare = createBareServer('/bare/');
const serve = new nodeStatic.Server('main/');

const server = http.createServer();

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    serve.serve(req, res, (err) => {
      if (err) {
        res.writeHead(err.status || 500, err.headers || {});
        res.end();
      }
    });
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req, socket, head)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

import { create_lithium_server } from 'lithium.js';

const { server, port } = create_lithium_server({
  staticDir: 'main',
  port: process.env.PORT || 8080,
  proxy: process.env.PROXY || 'ultraviolet',
  transport: process.env.TRANSPORT || 'epoxy',
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

server.listen(port, () => {
  console.log(`Lithium server running on http://localhost:${port}`);
});

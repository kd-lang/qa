
// This is an example file for the QA Inspector to parse.

import express, { Express } from 'express';
import * as http from 'http';

const app: Express = express();

function setupServer() {
  const server = http.createServer(app);
  server.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
}

setupServer();

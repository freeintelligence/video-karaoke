import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { config } from '../config';

export class HttpServer {
  
  constructor() { }

  async run() {
    await this.create();
  }

  async create() {
    http.createServer((req, res) => {
      const stream = fs.createReadStream(config.databasePath(req.url));

      stream.on('error', () => {
        res.writeHead(404);
        res.end();
      });

      stream.pipe(res);
    }).listen(config.httpServer.port);
  }

}

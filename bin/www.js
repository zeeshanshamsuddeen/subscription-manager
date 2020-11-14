#!/usr/bin/env node
require('dotenv').config();
const http = require('http');
const config = require('../server/config');

const { PORT } = config.appDefaults;

const app = require('../server');

const server = http.createServer(app);

server.listen(PORT, (err) => {
  if (err) {
    return err;
  }
  return true;
});

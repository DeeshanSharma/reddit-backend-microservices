import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { config as dotenvConfig } from 'dotenv';
import connectDB from './database/index.js';
import * as postImplementation from './implementations/subreddit.implementation.js';

dotenvConfig();
connectDB();

const packageDefinition = loadSync('../../protos/subreddit.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const SubredditService = loadPackageDefinition(packageDefinition).SubredditService;

const server = new Server();
server.bindAsync('localhost:5003', ServerCredentials.createInsecure(), (err) => {
  if (err) console.error(`⚡[SUBREDDIT SERVICE]: Failed to start`, err);
  else {
    server.start();
    console.log('⚡[SUBREDDIT SERVICE]: Running at http://localhost:5003');
  }
});
server.addService(SubredditService.service, postImplementation);

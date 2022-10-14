import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { config as dotenvConfig } from 'dotenv';
import connectDB from './database/index.js';
import * as postImplementation from './implementations/posts.implementation.js';

dotenvConfig();
connectDB();

const packageDefinition = loadSync('../../protos/post.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const PostService = loadPackageDefinition(packageDefinition).PostService;

const server = new Server();
server.bindAsync('localhost:5002', ServerCredentials.createInsecure(), (err) => {
  if (err) console.error(`⚡[POST SERVICE]: Failed to start`, err);
  else {
    server.start();
    console.log('⚡[POST SERVICE]: Running at http://localhost:5002');
  }
});
server.addService(PostService.service, postImplementation);

import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { config as dotenvConfig } from 'dotenv';
import connectDB from './database/index.js';
import * as userImplementation from './implementations/user.implementation.js';

dotenvConfig();
connectDB();

const server = new Server();

const packageDefinition = loadSync('../../protos/user.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const UserService = loadPackageDefinition(packageDefinition).UserService;

server.bindAsync('localhost:5001', ServerCredentials.createInsecure(), (err) => {
  if (err) console.error(`⚡[USER SERVICE]: Failed to start`, err);
  else {
    server.start();
    console.log('⚡[USER SERVICE]: Running at http://localhost:5001');
  }
});
server.addService(UserService.service, userImplementation);

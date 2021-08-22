PROTO_PATH = './users.proto';

const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const users = JSON.parse(fs.readFileSync('users.json')) || [];
const usersProto = grpc.loadPackageDefinition(packageDefinition).usersPackage;

function addUsers(call, callback) {
  let count = 0;
  call.on('data', (data) => {
    users.push(data);
    count++;
  });
  call.on('end', () => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    callback(null, {message: "Добавлено " + count });
  })
}


function getUsersByNames(call) {
  call.on('data', ({ name }) => {
    users.filter(user => user.name === name).forEach(user => call.write(user));
  });
  call.on('end', () => {
    call.end();
  });
}


function getUserById(call, callback) {
  const { request: { id } } = call;
  callback(null, users.find(user => user.id === id))
}

function getUsers(call) {
  users.forEach(user => {
    call.write(user);
  })
  call.end();
}

function main() {
  var server = new grpc.Server();
  server.addService(usersProto.CRUD.service,
    {
      getUserById,
      getUsers,
      addUsers,
      getUsersByNames,
    });
  server.bindAsync('localhost:3006', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
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

const usersProto = grpc.loadPackageDefinition(packageDefinition).usersPackage;


function main() {
  const client = new usersProto.CRUD('localhost:3006', grpc.credentials.createInsecure());

  getUsersByNames(client, ['Egor', 'Dima']);
  // getUserById(client, { id: '3' });
  
  // getUsers(client);

  // addUsers(client,  [{ id: '123', name: "Egor", age: 40 }, { id: '132', name: "Egor", age: 33 }]);
}

main();

function getUsersByNames(client, usersNames) {
  const call = client.getUsersByNames();
  call.on("data", (data) => {
    console.log("user", data);
  })
  call.on("end", (data) => {
    console.log("конец на клиенте");
  })

  usersNames.forEach(name => {
    call.write({ name });
  });
  call.end();
}

function addUsers(client, users) {
  const call = client.addUsers((err, res) => {
    console.log(res.message);
  });
  users.forEach(user => {
    call.write(user);
  });
  call.end();
}

function getUserById(client, data) {
   client.getUserById(data, (err, user) => {
    console.log("Нашли пользователя " + user.name, user);
  });
}

function getUsers(client) {
  const callUsers = client.getUsers();
  callUsers.on('data', (data) => {
    console.log("data", data);
  });
  callUsers.on("end", () => {
    console.log("Расчет окночен");
  })
}

const fs = require('fs');
users = [
  {
    id: '1',
    name: 'Egor',
    age: 20,
  },
  {
    id: '2',
    name: 'Dima',
    age: 22,
  },
  {
    id: '3',
    name: 'Vova',
    age: 23,
  },
]
fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
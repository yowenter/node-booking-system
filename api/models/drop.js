const Node = require('./Nodes')
const User = require('./User')

Node.deleteMany()
  .then(() => {
    console.log('Deleted rooms')
    process.exit()
  })

User.deleteMany()
  .then(() => {
    console.log('Deleted users')
    process.exit()
  })
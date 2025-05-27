require('dotenv').config()



const Server = require('./src/server/server')
require('./src/cron-jobs/checkContractsJob');

const server = new Server()

server.listen();
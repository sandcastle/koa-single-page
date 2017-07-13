const app = require('./server');
const config = require('./config');

console.log('App Server');
console.log(`  Host : ${config.host}`);
console.log(`  Port : ${config.port}`);
console.log(`  API  : ${config.api}`);

app.listen(config.port, config.host);

const server = require('./server');
const conf = require('./config');

console.log('App Server');
console.log(`  Host : ${conf.host}`);
console.log(`  Port : ${conf.port}`);
console.log(`  API  : ${conf.api}`);

app.listen(conf.port, conf.host);

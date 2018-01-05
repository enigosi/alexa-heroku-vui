const app = require('./app');

// get schema and utterances - copy & paste to alexa interaction mdoel

console.log('SCHEMA: ');
console.log(app.schema());

console.log();
console.log('UTTERANCES: ');
console.log(app.utterances());

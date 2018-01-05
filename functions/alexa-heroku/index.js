const app = require('./src/app');

// connect the alexa-app to AWS Lambda
exports.handle = app.lambda();

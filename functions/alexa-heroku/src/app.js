const alexa = require('alexa-app');
const intentHandlers = require('./intent-handlers');

// eslint-disable-next-line new-cap
const app = new alexa.app('alexa-heroku');

app.launch((request, response) => {
  response.say('Hello');
});

app.intent('AppStatus', {
  slots: {
    VALUE: 'AMAZON.Animal',
  },
  utterances: [
    'what is the status of {APP_NAME}',
    'what is the status of {APP_NAME} app',
    'how is {APP_NAME} doing',
  ],
}, (req, res) => intentHandlers.handleAppStatusIntent(req, res));


module.exports = app;

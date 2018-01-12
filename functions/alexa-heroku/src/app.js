const alexa = require('alexa-app');
const intentHandlers = require('./intent-handlers');

// eslint-disable-next-line new-cap
const app = new alexa.app('alexa-heroku');

app.dictionary = {
  appStage: ['test', 'review', 'development', 'staging', 'production'],
  appStatus: ['crashed', 'dawn', 'idle', 'starting', 'up'],
};

app.launch((request, response) => {
  response.say('Welcome to alexa heroku app.');
});

app.intent('AppStatus', {
  slots: {
    APP_NAME: 'AMAZON.Animal',
  },
  utterances: [
    'what is the status of {APP_NAME}',
    'what is the status of {APP_NAME} app',
    'how is {APP_NAME} doing',
  ],
}, (req, res) => intentHandlers.handleAppStatusIntent(req, res));

app.intent('AppStatusWithStage', {
  slots: {
    APP_NAME: 'AMAZON.Animal',
    APP_STAGE: 'LITERAL',
  },
  utterances: [
    'what is the status of {APP_NAME} {appStage|APP_STAGE}',
    'what is the status of {APP_NAME} app on {appStage|APP_STAGE}',
    'what is the status of {APP_NAME} app {appStage|APP_STAGE}',
    'how is {APP_NAME} doing {appStage|APP_STAGE}',
  ],
}, (req, res) => intentHandlers.handleAppStatusIntent(req, res));

app.intent('SystemStatus', {
  utterances: [
    'what is the status of my heroku',
    'how are my apps doing',
    'what is the status of my apps',
  ],
}, (req, res) => intentHandlers.handleAppStatusIntent(req, res));

app.intent('UniversalTest', {
  slots: {
    APP_NAME: 'AMAZON.Animal',
    APP_STAGE: 'LITERAL',
  },
  utterances: [
    'what is the status of {APP_NAME}',
    'what is the status of {APP_NAME} app',
    'how is {APP_NAME} doing',
    'what is the status of {APP_NAME} {appStage|APP_STAGE}',
    'what is the status of {APP_NAME} app on {appStage|APP_STAGE}',
    'what is the status of {APP_NAME} app {appStage|APP_STAGE}',
    'how is {APP_NAME} doing {appStage|APP_STAGE}',
    'what is the status of my heroku',
    'how are my apps doing',
    'what is the status of my apps',
    'what is the status of my heroku',
    'how are my apps doing',
    'what is the status of my apps',
  ],
}, (req, res) => intentHandlers.handleAppStatusIntent(req, res));


module.exports = app;

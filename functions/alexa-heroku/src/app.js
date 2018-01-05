const alexa = require('alexa-app');

// eslint-disable-next-line new-cap
const app = new alexa.app('alexa-heroku');

app.launch((request, response) => {
  response.say('Hello');
});

app.intent(
  'testNumber', {
    slots: { number: 'AMAZON.NUMBER' },
    utterances: ['say the test number {-|number}'],
  },
  (request, response) => {
    const number = request.slot('number');
    response.say(`${number}`);
  },
);

module.exports = app;

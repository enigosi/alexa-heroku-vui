const herokuService = require('./heroku-service');

const NOT_EXPECTED_ERROR_MESSAGE = 'I was unable to connect to Heroku.';

// eslint-disable-next-line consistent-return
module.exports.handleAppStatusIntent = async function handleAppStatusIntent(req, res) {
  try {
    const { accessToken } = req.data.session.user;
    if (!accessToken) return res.say('Please log in to Heroku to use this skill');
    const heroku = herokuService.getHerokuInstance(accessToken);

    const allApps = await herokuService.getAllApps(heroku);

    const appName = req.slot('VALUE');
    const foundApps = allApps.filter(app => app.configVars.ALEXA_HEROKU_NAME === appName);

    if (!foundApps.length) {
      return res.say(`I was unable to find app ${appName}`);
    }

    // NOTE each app on heroku has a dyno
    const foundDynos = await herokuService.getDynosByAppIds(foundApps.map(app => app.id));

    // NOTE for now i am assuming that each app is on right pipeline
    const pipelineCouplings = await herokuService.getAllPipelineCouplings(heroku);

    foundApps.forEach((app) => {
      const foundDyno = foundDynos.find(dyno => dyno.app.id === app.id);
      const foundPipeLineCoupling = pipelineCouplings.find(coupling => coupling.app.id === app.id);
      res.say(`The status of app ${appName} ${foundPipeLineCoupling.stage} is ${foundDyno.state}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('ERRROR', e.displayMessage, e, e.stack);
    res.say(e.displayMessage || NOT_EXPECTED_ERROR_MESSAGE);
    return e;
  }
};

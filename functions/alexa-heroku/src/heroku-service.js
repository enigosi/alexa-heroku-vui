const Heroku = require('heroku-client');
const { CustomError } = require('./utils');

module.exports.getHerokuInstance = function getHerokuInstance(accessToken) {
  return new Heroku({ token: accessToken });
};

module.exports.getAllApps = async function getAllApps(herokuInstance) {
  const herokuApps = await herokuInstance.get('/apps')
    .catch((e) => {
      if (e.statusCode === 401) throw new CustomError('You were unauthorized', e);
      throw new CustomError('There was a problem with connecting to Heroku');
    });

  if (!herokuApps || !herokuApps.length) return [];

  const appsWithEnvVars = Promise.all(herokuApps.map(async (herokuApp) => {
    const appEnvVars = await herokuInstance.get(`/apps/${herokuApp.id}/config-vars`);
    return { ...herokuApp, configVars: appEnvVars };
  }));

  return appsWithEnvVars;
};

module.exports.getAllPipelineCouplings = async function getAllPipelineCouplings(herokuInstance) {
  const pipelines = await herokuInstance.get('/pipelines');

  const pipelinesWithCouplings = await Promise.all(pipelines.map(async pipeline =>
    herokuInstance.get(`/pipelines/${pipeline.id}/pipeline-couplings`)));

  const couplings = [].concat(...pipelinesWithCouplings);

  return couplings;
};

// NOTE app is supporting only single dyno per app
module.exports.getDynosByAppIds = async function getDynosByAppIds(herokuInstance, appIds) {
  if (!appIds || !Array.isArray(appIds) || !appIds.length) return [];

  const dynos = await Promise.all(appIds.map(async appId =>
    herokuInstance.get(`/apps/${appId}/dynos`)));

  const flatDynos = [].concat(...dynos);
  return flatDynos;
};

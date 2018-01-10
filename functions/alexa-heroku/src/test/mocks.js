
// fake heroku account data
const fakeApps = [{
  id: '1',
  name: 'test-app-1',
},
{
  id: '2',
  name: 'test-app-2',
},
{
  id: '3',
  name: 'test-app-3',
},
{
  id: '4',
  name: 'test-app-4',
}];

const fakeDynos = [
  {
    state: 'crashed',
    app: { id: '1' },
  },
  {
    state: 'crashed',
    app: { id: '2' },
  },
  {
    state: 'crashed',
    app: { id: '3' },
  },
  {
    state: 'crashed',
    app: { id: '4' },
  },
];

const fakeConfigVars = {
  1: { ALEXA_HEROKU_NAME: 'spider monkey' },
  3: { ALEXA_HEROKU_NAME: 'jaguar' },
  4: { ALEXA_HEROKU_NAME: 'jaguar' },
  2: { ALEXA_HEROKU_NAME: 'spider monkey' },
};

const fakePipelines = [{ id: '1' }];

const fakePipelineCouplings = [
  {
    app: { id: '1' },
    stage: 'staging',
  },
  {
    app: { id: '2' },
    stage: 'production',
  },
  {
    app: { id: '3' },
    stage: 'staging',
  },
  {
    app: { id: '4' },
    stage: 'production',
  },
];

// fake endpoints
const fakeConfigVarsEnpoints = Object.keys(fakeConfigVars).reduce((prev, fakeAppId) => ({
  ...prev,
  [`/apps/${fakeAppId}/config-vars`]: fakeConfigVars[fakeAppId],
}), {});

const fakeDynosEnpoints = fakeDynos.reduce((prev, fakeDyno) => ({
  ...prev,
  // NOTE for spilification i am are assuming that there is only one dyno per app
  [`/apps/${fakeDyno.app.id}/dynos`]: [fakeDyno],
}), {});

const fakeAppsEndpoint = {
  '/apps': fakeApps,
};

const fakePipelinesEndpoint = {
  '/pipelines': fakePipelines,
};

const fakePipelineCouplingsEndpoint = {
  '/pipelines/1/pipeline-couplings': fakePipelineCouplings,
};

const fakeEndpoints = {
  configVars: fakeConfigVarsEnpoints,
  apps: fakeAppsEndpoint,
  dynos: fakeDynosEnpoints,
  pipelines: fakePipelinesEndpoint,
  pipelineCouplings: fakePipelineCouplingsEndpoint,
};


module.exports = {
  fakeApps, fakeDynos, fakeConfigVars, fakeEndpoints,
};

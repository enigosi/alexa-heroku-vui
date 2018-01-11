const chai = require('chai');
const mocks = require('./mocks.js');
const sinon = require('sinon');
const herokuService = require('../heroku-service');
const intentHandlers = require('../intent-handlers');

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe('Intent Handlers', () => {
  describe('handleAppStatusIntent', () => {
    afterEach(() => {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
    });

    it('returns right data for filled heroku account', async () => {
      const FAKE_ACCESS_TOKEN = 'FAKE_ACCESS_TOKEN';
      const GET_ALL_APPS_EXPECTED = [{
        id: '1',
        name: 'test-app-1',
        configVars: { ALEXA_HEROKU_NAME: 'spider monkey' },
      },
      {
        id: '2',
        name: 'test-app-2',
        configVars: { ALEXA_HEROKU_NAME: 'spider monkey' },
      },
      {
        id: '3',
        name: 'test-app-3',
        configVars: { ALEXA_HEROKU_NAME: 'jaguar' },
      },
      {
        id: '4',
        name: 'test-app-4',
        configVars: { ALEXA_HEROKU_NAME: 'jaguar' },
      }];

      const GET_ALL_PIPELINE_COUPLINGS_EXPECTED = [
        { app: { id: '1' }, stage: 'staging' },
        { app: { id: '2' }, stage: 'production' },
        { app: { id: '3' }, stage: 'staging' },
        { app: { id: '4' }, stage: 'production' },
      ];

      // fake heroku.get
      const fakeHerokuGet = sandbox.spy((path) => {
        const fakeEndpoints = {
          ...mocks.fakeEndpoints.dynos,
        };

        return Promise.resolve(fakeEndpoints[path]);
      });
      const fakeHerokuInstance = { get: fakeHerokuGet };

      // fake heroku service
      sandbox.stub(herokuService, 'getHerokuInstance').returns(fakeHerokuInstance);
      sandbox.stub(herokuService, 'getAllApps').returns(Promise.resolve(GET_ALL_APPS_EXPECTED));
      sandbox.stub(herokuService, 'getAllPipelineCouplings')
        .returns(Promise.resolve(GET_ALL_PIPELINE_COUPLINGS_EXPECTED));
      sandbox.stub(herokuService, 'getDynosByAppIds')
        .callsFake((heroku, ids) => {
          const dynos = mocks.fakeDynos.filter(dyno => ids.includes(dyno.app.id));
          return Promise.resolve(dynos);
        });

      // fake req
      const fakeReq = {
        data: {
          session: {
            user: {
              accessToken: FAKE_ACCESS_TOKEN,
            },
          },
        },
        slot: sandbox.spy(() => 'jaguar'),
      };

      // fake res
      const fakeRes = {
        say: sandbox.spy(() => ({})),
      };

      await intentHandlers.handleAppStatusIntent(fakeReq, fakeRes);
      sinon.assert.callCount(herokuService.getHerokuInstance, 1);
      sinon.assert.calledWith(herokuService.getHerokuInstance, FAKE_ACCESS_TOKEN);
      sinon.assert.calledWith(herokuService.getAllApps, fakeHerokuInstance);
      sinon.assert.calledWith(herokuService.getAllPipelineCouplings, fakeHerokuInstance);
      sinon.assert.calledWith(herokuService.getDynosByAppIds, fakeHerokuInstance, ['3', '4']);

      sinon.assert.callCount(fakeRes.say, 2);
      sinon.assert.calledWith(fakeRes.say, 'The status of app jaguar staging is crashed');
      sinon.assert.calledWith(fakeRes.say, 'The status of app jaguar production is crashed');
      sinon.assert.calledWith(fakeReq.slot, 'APP_NAME');
    });
  });
});

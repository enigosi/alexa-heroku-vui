const chai = require('chai');
const mocks = require('./mocks.js');
const sinon = require('sinon');
const herokuService = require('../heroku-service');

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe('Heroku Service', () => {
  describe('getAllApps', () => {
    afterEach(() => {
      // completely restore all fakes created through the sandbox
      sandbox.restore();
    });

    it('returns right data for filled heroku account', async () => {
      // fake Heroku
      const fakeHerokuGet = sandbox.spy((path) => {
        const fakeEndpoints = {
          ...mocks.fakeEndpoints.apps,
          ...mocks.fakeEndpoints.configVars,
        };

        return Promise.resolve(fakeEndpoints[path]);
      });


      const receivedResult = await herokuService.getAllApps({ get: fakeHerokuGet });
      expect(receivedResult).to.be.an('array');
      expect(receivedResult).to.have.length(4);
      expect(receivedResult[0]).to.deep.own.include({ configVars: { ALEXA_HEROKU_NAME: 'spider monkey' } });
      expect(receivedResult[3]).to.include.keys('id', 'name', 'configVars');
      sinon.assert.callCount(fakeHerokuGet, 5);
    });
  });

  describe('getAllPipelineCouplings', () => {
    it('returns right data for filled heroku account', async () => {
      // fake Heroku
      const fakeHerokuGet = sandbox.spy((path) => {
        const fakeEndpoints = {
          ...mocks.fakeEndpoints.pipelines,
          ...mocks.fakeEndpoints.pipelineCouplings,
        };

        return Promise.resolve(fakeEndpoints[path]);
      });

      const receivedResult = await herokuService.getAllPipelineCouplings({ get: fakeHerokuGet });

      expect(receivedResult).to.be.an('array');
      expect(receivedResult).to.have.length(4);
      expect(receivedResult[3]).to.include.keys('app', 'stage');
      sinon.assert.callCount(fakeHerokuGet, 2);
    });
  });

  describe('getDynosByAppIds', () => {
    it('returns right data for filled heroku account', async () => {
      // fake Heroku
      const fakeHerokuGet = sandbox.spy((path) => {
        const fakeEndpoints = {
          ...mocks.fakeEndpoints.dynos,
        };

        return Promise.resolve(fakeEndpoints[path]);
      });

      const appIds = [3, 1, 2];
      const receivedResult = await herokuService.getDynosByAppIds({ get: fakeHerokuGet }, appIds);

      expect(receivedResult).to.be.an('array');
      expect(receivedResult).to.have.length(3);
      expect(receivedResult[2]).to.include.keys('app', 'state');
      sinon.assert.callCount(fakeHerokuGet, 3);
    });
  });
});

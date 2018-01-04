const AlexaAppServer = require('alexa-app-server');

AlexaAppServer.start({
  public_html: 'public_html',
  app_dir: 'functions',
  app_root: 'alexa',
  server_root: '.',
  port: 8080,
  log: true,
  debug: true,
});

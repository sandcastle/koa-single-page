const Config = {

  root: '../../dist',

  get host() {
    return process.env.HOST || 'localhost';
  },

  get port() {
    return process.env.PORT || '8002';
  },

  get api() {
    return process.env.API_URL || 'http://localhost:8003/';
  },

  get debug() {
    return true || process.env.DEBUG === 'true';
  },

  get staticRoot() {
    return this.root;
  },

  useTestFiles() {
    this.root = '../../test/files';
  }
};

module.exports = Config;

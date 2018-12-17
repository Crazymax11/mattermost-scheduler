module.exports = class MattermostWebhookStorage {
  constructor() {
    this.hooks = {};
  }

  save({ url, name }) {
    if (!url) throw new Error('url should be provided');
    if (typeof url !== 'string') throw new Error('url should be a string');
    if (!name) throw new Error('name should be provided');
    if (typeof name !== 'string') throw new Error('name should be a string');

    this.hooks[name] = { url, name };
  }

  getAll() {
    return this.hooks;
  }

  getByName(name) {
    return this.hooks[name];
  }
};

const _ = require('lodash');
const Storage = require('./mattermostWebhookStorage');

const webhookObject = {
  url: 'testurl',
  name: 'testname',
};
describe('mattermostWebhookStorage', () => {
  it('should be a function', () => {
    expect(typeof Storage).toEqual('function');
  });

  it('should store webhook url and name and than get url by name', () => {
    const storage = new Storage();

    storage.save(webhookObject);

    expect(storage.getByName(webhookObject.name)).toEqual(webhookObject);
  });

  it('should store webhook url and name and than get all with new', () => {
    const storage = new Storage();

    storage.save(webhookObject);

    expect(storage.getAll()).toEqual({ [webhookObject.name]: webhookObject });
  });

  it('should throw error if url is not provided', () => {
    const storage = new Storage();

    expect(() => storage.save(_.omit(webhookObject, ['url']))).toThrowError('url should be provided');
  });

  it('should throw error if name is not provided', () => {
    const storage = new Storage();

    expect(() => storage.save(_.omit(webhookObject, ['name']))).toThrowError('name should be provided');
  });

  it('should rewrite hook if saves twice', () => {
    const storage = new Storage();
    storage.save(webhookObject);
    storage.save({ name: webhookObject.name, url: 'newurl' });
    expect(storage.getByName(webhookObject.name)).toEqual({ name: webhookObject.name, url: 'newurl' });
  });

  it('should save two hooks', () => {
    const storage = new Storage();
    storage.save(webhookObject);
    storage.save({
      ...webhookObject,
      name: 'test2',
    });
    expect(storage.getAll()).toEqual({
      [webhookObject.name]: webhookObject,
      test2: {
        ...webhookObject,
        name: 'test2',
      },
    });
  });
});

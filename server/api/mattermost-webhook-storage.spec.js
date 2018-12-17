const supertest = require('supertest');
const express = require('express');
const _ = require('lodash');
const api = require('./mattermost-webhook-storage');

const webhookData = {
  url: 'testurl',
  name: 'testname',
};

describe('mattermost-messager-api', () => {
  let app;

  beforeEach(() => {
    app = express();

    const middleware = api();

    app.use('/webhooks', middleware);
  });
  it('should be a function', () => {
    expect(typeof api).toEqual('function');
  });

  it('should store webhook if url and name are provided', async () => {
    await supertest(app)
      .post('/webhooks')
      .send(webhookData)
      .expect(200);

    await supertest(app)
      .get(`/webhooks/${webhookData.name}`)
      .expect(200, webhookData);
  });

  it('should send 400 if url is not provided', () => supertest(app)
    .post('/webhooks')
    .send(_.omit(webhookData, ['url']))
    .expect(400, 'url and name must be provided'));

  it('should send 400 if name is not provided', () => supertest(app)
    .post('/webhooks')
    .send(_.omit(webhookData, ['name']))
    .expect(400, 'url and name must be provided'));

  it('should store 2 webhooks', async () => {
    await supertest(app)
      .post('/webhooks')
      .send(webhookData)
      .expect(200);

    await supertest(app)
      .post('/webhooks')
      .send({ ...webhookData, name: 'test2' })
      .expect(200);

    await supertest(app)
      .get('/webhooks')
      .expect(200, {
        [webhookData.name]: webhookData,
        test2: {
          ...webhookData,
          name: 'test2',
        },
      });
  });
  it('should store 1 webhooks twice', async () => {
    await supertest(app)
      .post('/webhooks')
      .send(webhookData)
      .expect(200);

    await supertest(app)
      .post('/webhooks')
      .send(webhookData)
      .expect(200);

    await supertest(app)
      .get('/webhooks')
      .expect(200, {
        [webhookData.name]: webhookData,
      });
  });
});

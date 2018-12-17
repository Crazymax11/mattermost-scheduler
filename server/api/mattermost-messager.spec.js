
const supertest = require('supertest');
const express = require('express');
const _ = require('lodash');
const api = require('./mattermost-messager.js');
const testData = require('../../common/mattermostFixtures');

describe('mattermost-messager-api', () => {
  const app = express();
  const sendMattermostMessage = jest.fn(() => Promise.resolve());
  const middleware = api({
    sendMattermostMessage,
  });

  app.use('/messages', middleware);
  beforeEach(() => {
    sendMattermostMessage.mockReset();
    sendMattermostMessage.mockImplementation(() => Promise.resolve());
  });


  it('should be a function', () => {
    expect(typeof api).toEqual('function');
  });

  it('should send a message and return 200 then url and text provided', async () => {
    await supertest(app)
      .post('/messages')
      .send(_.pick(testData, ['url', 'text']))
      .expect(200);
    expect(sendMattermostMessage).toHaveBeenCalledWith(_.pick(testData, ['url', 'text']));
  });

  it('should send a message and return 200 then url, text, iconUrl, username and channel provided', async () => {
    await supertest(app)
      .post('/messages')
      .send(testData)
      .expect(200);
    expect(sendMattermostMessage).toHaveBeenCalledWith(testData);
  });

  it('should return 400 then url is not provided', async () => {
    await supertest(app)
      .post('/messages')
      .send(_.omit(testData, ['url']))
      .expect(400, 'url and text must be provided');
    expect(sendMattermostMessage).not.toHaveBeenCalled();
  });
  it('should return 400 then text is not provided', async () => {
    await supertest(app)
      .post('/messages')
      .send(_.omit(testData, ['text']))
      .expect(400, 'url and text must be provided');
    expect(sendMattermostMessage).not.toHaveBeenCalled();
  });
  it('should return 400 then url and text are not provided', async () => {
    await supertest(app)
      .post('/messages')
      .send(_.omit(testData, ['url', 'text']))
      .expect(400, 'url and text must be provided');
    expect(sendMattermostMessage).not.toHaveBeenCalled();
  });

  it('should return 500 then sendMattermostMessage have failed', () => {
    sendMattermostMessage.mockImplementationOnce(() => Promise.reject(new Error('test')));
    return supertest(app)
      .post('/messages')
      .send(testData)
      .expect(500, 'test');
  });
});

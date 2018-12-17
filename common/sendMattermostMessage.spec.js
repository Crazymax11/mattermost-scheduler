/* eslint-env jest */
const axios = require('axios');
const _ = require('lodash');
const sendMessage = require('./sendMattermostMessage.js');
const testData = require('./mattermostFixtures');

jest.mock('axios', () => ({
  default: {
    post: jest.fn(() => Promise.resolve()),
  },
}));


describe('sendMattermostMessage', () => {
  afterEach(() => {
    axios.default.post.mockReset();
  });
  it('should be a function', () => {
    expect(typeof sendMessage === 'function').toBe(true);
  });

  it('should reject if url is not a string', async () => expect(sendMessage({ ...testData, url: 123 })).rejects.toThrow(
    'url should be a string',
  ));
  it('should reject if url is not provided', async () => expect(sendMessage({ ...testData, url: undefined })).rejects.toThrow(
    'url should be provided',
  ));
  it('should reject if text is not a string', async () => expect(sendMessage({ ...testData, text: 123 })).rejects.toThrow(
    'text should be a string',
  ));
  it('should reject if text is not provided', async () => expect(sendMessage({ ...testData, text: undefined })).rejects.toThrow(
    'text should be provided',
  ));

  it('should send message', async () => {
    await sendMessage(testData);
    expect(axios.default.post).toHaveBeenCalledWith(testData.url, {
      username: testData.username,
      text: testData.text,
      channel: testData.channel,
      icon_url: testData.iconUrl,
    });
  });

  it('should throw error if axios will fail', () => {
    axios.default.post.mockImplementation(() => Promise.reject(new Error('test')));
    return expect(sendMessage(testData)).rejects.toThrow('test');
  });

  it('should send message if only url and text provided', async () => {
    await sendMessage(_.pick(testData, ['url', 'text']));
    expect(axios.default.post).toHaveBeenCalledWith(testData.url, {
      text: testData.text,
    });
  });
});

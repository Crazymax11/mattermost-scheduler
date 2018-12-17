const axios = require('axios');

/**
 * Send message to mattermost webhook url
 *
 * @see https://docs.mattermost.com/developer/webhooks-incoming.html#how-do-i-send-a-webhook-post-to-a-direct-message-channel
 * @param {String} param.url        webhookUrl
 * @param {String} param.text       text in markdown format
 * @param {String?} param.channel   '@username' for private and 'channel-name' for channel messages
 * @param {String?} param.username  will be shown as author of message
 * @param {String?} param.iconUrl   url to 128x128 png or jpeg image, will be displayed as avatar
 * @returns {Promise} axiosResult
 */
module.exports = async function sendMattermostMessage({
  url, text, channel, username, iconUrl,
}) {
  if (!url) throw new Error('url should be provided');
  if (typeof url !== 'string') throw new Error('url should be a string');
  if (!text) throw new Error('text should be provided');
  if (typeof text !== 'string') throw new Error('text should be a string');

  return axios.default.post(url, {
    text,
    channel,
    username,
    icon_url: iconUrl,
  });
};

const express = require('express');
const bodyParser = require('body-parser');

module.exports = function createMattermostMessagerEndpoint({ sendMattermostMessage }) {
  const router = express.Router();
  router.use(bodyParser.json());
  router.post('/', async (req, res) => {
    const {
      url, text, iconUrl, username, channel,
    } = req.body;

    if (!url || !text) {
      res.status(400);
      return res.send('url and text must be provided');
    }

    return sendMattermostMessage({
      url, text, iconUrl, username, channel,
    }).then(() => res.send('OK')).catch((err) => {
      res.status(500);
      res.send(err.message);
      console.error(err);
    });
  });

  return router;
};

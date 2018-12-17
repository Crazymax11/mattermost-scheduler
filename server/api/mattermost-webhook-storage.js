const express = require('express');
const bodyParser = require('body-parser');
const Storage = require('../../common/mattermostWebhookStorage');

module.exports = function createMattermostWebhooksEndpoint() {
  const router = express.Router();
  router.use(bodyParser.json());
  const storage = new Storage();

  router.post('/', async (req, res) => {
    const {
      url, name,
    } = req.body;

    if (!url || !name) {
      res.status(400);
      return res.send('url and name must be provided');
    }

    storage.save({ url, name });

    res.send('OK');
  });

  router.get('/:name', async (req, res) => {
    res.json(storage.getByName(req.params.name));
  });

  router.get('/', async (req, res) => {
    res.json(storage.getAll());
  });


  return router;
};

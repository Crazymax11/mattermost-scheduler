const express = require('express');
const mattermostMessangerEndpoint = require('./mattermost-messager');
const mattermostWebhooksEndpoint = require('./mattermost-webhook-storage');
const sendMattermostMessage = require('../../common/sendMattermostMessage');

const router = express.Router();
router.use('/v1/messages', mattermostMessangerEndpoint({ sendMattermostMessage }));
router.use('/v1/webhooks', mattermostWebhooksEndpoint());

module.exports = router;

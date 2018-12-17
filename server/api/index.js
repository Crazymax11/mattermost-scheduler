const express = require('express');
const mattermostMessangerEndpoint = require('./mattermost-messager');
const sendMattermostMessage = require('../../common/sendMattermostMessage');

console.log('create');
const router = express.Router();
router.use('/v1/messages', mattermostMessangerEndpoint({ sendMattermostMessage }));

module.exports = router;

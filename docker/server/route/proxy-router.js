const express = require('express');
const proxyRouter = express.Router();

const { validateProxy } = require('../middleware/validate');
const {  proxyController } = require('../controller/proxy-controller');

proxyRouter.post('/proxy',validateProxy,proxyController);

module.exports = { proxyRouter };

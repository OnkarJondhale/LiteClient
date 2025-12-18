const express = require('express');
const proxyRouter = express.Router();

const {  proxyController } = require('../controller/proxy-controller');

proxyRouter.post('/proxy',proxyController);

module.exports = { proxyRouter };

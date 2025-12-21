const express = require('express')
const apiMockRouter = express.Router()

const { validateApiMock } = require('../middleware/validate');
const { apiMockController } = require('../controller/apimock-controller');

apiMockRouter.post('/apimock',validateApiMock,apiMockController);

module.exports = { apiMockRouter };
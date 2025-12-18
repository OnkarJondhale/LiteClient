const express = require('express');
const cors = require('cors');
const app = express();

const { proxyRouter } = require('./route/proxy-router');

app.use(cors());
app.use(express.json());

app.use(proxyRouter);

app.listen(9090);
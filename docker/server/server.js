const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { proxyRouter } = require('./route/proxy-router');

app.use(cors());
app.use(express.json());

app.use(proxyRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(9090);
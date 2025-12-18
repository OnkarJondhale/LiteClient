const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const { proxyRouter } = require('./route/proxy-router');

app.use(cors());
app.use(express.json());

app.use(proxyRouter);

app.use(express.static(path.join(__dirname, 'dist')));

const PORT = 9090;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
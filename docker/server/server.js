const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const { proxyRouter } = require('./route/proxy-router');
const { apiMockRouter } = require('./route/apimock-router');
const { interceptorRouter } = require('./route/interceptor-router');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        ok: true,
        message: "Server running successfully"
    });
});

app.use(proxyRouter);
app.use(apiMockRouter);

app.use(interceptorRouter);

app.use(express.static(path.join(__dirname, 'dist')));

const PORT = 9090;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
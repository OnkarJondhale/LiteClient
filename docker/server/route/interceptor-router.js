const express = require('express');
const interceptorRouter = express.Router();
const { getMockRegistry } = require('../controller/apimock-controller');

interceptorRouter.all(/.*/, (req, res, next) => {
    const registry = getMockRegistry();
    
    const match = registry.find(m => 
        m.isActive && 
        m.method === req.method && 
        (m.path === req.path || m.path === `/${req.path}`)
    );

    if (match) {
        if (match.headers) {
            match.headers.forEach(h => {
                if (h.key && h.value) res.setHeader(h.key, h.value);
            });
        }

        try {
            const data = match.body ? JSON.parse(match.body) : {};
            return res.status(Number(match.status)).json(data);
        } catch (e) {
            return res.status(Number(match.status)).send(match.body);
        }
    }
    next();
});

module.exports = { interceptorRouter };
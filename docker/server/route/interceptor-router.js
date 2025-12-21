const express = require('express');
const interceptorRouter = express.Router();
const { getMockRegistry } = require('../controller/apimock-controller');

interceptorRouter.all(/.*/, (req, res, next) => {
    const registry = getMockRegistry();
    
    const match = registry.find(m => {
        const pathMatch = (m.path === req.path || m.path === `/${req.path}`);
        const methodMatch = m.method === req.method;
        
        if (m.isActive && pathMatch && methodMatch) {
            if (m.headers && m.headers.length > 0) {
                for (const h of m.headers) {
                    if (h.key && h.value) {
                        const incomingHeader = req.get(h.key);
                        if (incomingHeader !== h.value) {
                            return false; 
                        }
                    }
                }
            }
            return true;
        }
        return false;
    });

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
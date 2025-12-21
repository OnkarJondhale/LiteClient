const proxyController = async (req, res) => {
    try {
        let { url, method, body, params, headers } = req.body;

        // Uncomment this in production environment
        if (url) {
            url = url.replace(/localhost|127\.0\.0\.1/g, 'host.docker.internal');
        }

        const targetUrl = new URL(url);
        if (params) {
            params.forEach(p => {
                if (p.key) targetUrl.searchParams.append(p.key, p.value);
            });
        }

        console.log(targetUrl)

        const startTime = performance.now();

        const response = await fetch(targetUrl.href, {
            method,
            headers: headers.reduce((acc, h) => {
                if (h.key) acc[h.key] = h.value;
                return acc;
            }, {}),
            body: (method !== 'GET' && method !== 'HEAD' && body) ? JSON.stringify(body) : undefined
        });

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        const sizeHeader = response.headers.get('content-length');
        const size = sizeHeader
            ? (parseInt(sizeHeader) / 1024).toFixed(2)
            : (Buffer.byteLength(typeof data === 'string' ? data : JSON.stringify(data)) / 1024).toFixed(2);

        res.json({
            status: response.status,
            ok: response.ok,
            data: data,
            time: duration,
            size: size
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: `Proxy Error: ${error.message}`,
            cause: error.cause?.message || "Unknown Network Error",
            time: 0,
            size: 0
        });
    }
}

module.exports = { proxyController };
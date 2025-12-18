import { useState } from 'react';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const sendRequest = async (config) => {
        const { url, method, params, headers, body } = config;

        setLoading(true);
        setResponse(null);

        try {
            const urlObj = new URL(url);
            params.forEach(p => {
                if (p.key.trim()) {
                    urlObj.searchParams.append(p.key.trim(), p.value.trim());
                }
            });

            const requestHeaders = new Headers();
            headers.forEach(h => {
                if (h.key.trim()) {
                    requestHeaders.append(h.key.trim(), h.value.trim());
                }
            });

            const options = {
                method,
                headers: requestHeaders,
            };

            if (method !== 'GET' && body) {
                options.body = body;
            }

            const startTime = Date.now();
            const res = await fetch(urlObj.toString(), options);
            const endTime = Date.now();

            const contentType = res.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
                time: `${endTime - startTime}ms`,
                data: data,
                headers: Object.fromEntries(res.headers.entries())
            });

        } catch (err) {
            setResponse({
                error: true,
                message: err.message,
                data: null
            });
        } finally {
            setLoading(false);
        }
    };

    return { sendRequest, loading, response, setResponse };
};
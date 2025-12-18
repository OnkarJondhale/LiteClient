import { useState } from 'react';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const sendRequest = async (config) => {
        const { url, method, params, headers, body } = config;

        setLoading(true);
        setResponse(null);

        try {
            const res = await fetch("http://localhost:9090/proxy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url,
                    method,
                    params: params.filter(p => p.key.trim() !== ""),
                    headers: headers.filter(h => h.key.trim() !== ""),
                    body: (method !== 'GET' && body) ? JSON.parse(body) : null
                }),
            });

            const result = await res.json();
            setResponse(result);

        } catch (err) {
            setResponse({
                error: true,
                message: err.message,
                status: 500,
                data: null,
                time: 0,
                size: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const abortRequest = () => {
        setLoading(false);
    };

    return { sendRequest, loading, response, setResponse, abortRequest };
};
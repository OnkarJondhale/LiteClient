import { useState, useEffect } from "react";
import JsonEditor from "./JsonEditor";
import { useApiClient } from "../hooks/useApiClient";
import { METHODS, COMMON_HEADERS, COMMON_VALUES, methodStyles } from "../constants";

export default function ApiClient({ initialData, onUpdate }) {
    const { sendRequest, loading, response, abortRequest } = useApiClient();

    const [method, setMethod] = useState(initialData.method || "GET");
    const [activeTab, setActiveTab] = useState(initialData.activeTab || "Params");
    const [url, setUrl] = useState(initialData.url || "");
    const [jsonBody, setJsonBody] = useState(initialData.jsonBody || "");
    const [params, setParams] = useState(initialData.params || [{ key: "", value: "" }]);
    const [headers, setHeaders] = useState(initialData.headers || [{ key: "Content-Type", value: "application/json" }]);
    const [isMethodOpen, setIsMethodOpen] = useState(false);

    useEffect(() => {
        onUpdate({ method, activeTab, url, jsonBody, params, headers });
    }, [method, activeTab, url, jsonBody, params, headers]);

    const updateRow = (isParam, idx, field, val) => {
        const list = isParam ? [...params] : [...headers];
        list[idx] = { ...list[idx], [field]: val };
        isParam ? setParams(list) : setHeaders(list);
    };

    const removeRow = (isParam, idx) => {
        const list = isParam ? params : headers;
        if (list.length > 1) {
            const next = list.filter((_, i) => i !== idx);
            isParam ? setParams(next) : setHeaders(next);
        }
    };

    const handleSend = () => {
        if (loading) { abortRequest(); return; }
        if (!url.trim()) return;
        sendRequest({ url_index:0, url, method, params, headers, body: method !== "GET" ? jsonBody : null, requestType: 'proxy' });
    };

    const highlight = (text) => {
        if (!text) return "";
        let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return html.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}|[\]])/g, (match) => {
            let cls = "text-blue-600 dark:text-blue-400";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) cls = "text-purple-600 dark:text-purple-400 font-bold";
                else cls = "text-green-600 dark:text-green-400";
            } else if (/[{}|[\]]/.test(match)) {
                cls = "text-gray-400";
            } else if (/null/.test(match)) {
                cls = "text-gray-500";
            }
            return `<span class="${cls}">${match}</span>`;
        });
    };

    const renderOutput = () => {
        if (loading) return "// Sending...";
        if (!response) return "// Response will appear here...";
        const rawData = response.data || response.message;
        const displayData = (typeof rawData === 'object' && rawData !== null)
            ? JSON.stringify(rawData, null, 4)
            : String(rawData).trim();
        return highlight(displayData);
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto space-y-4 p-4 text-[14px] text-[#18181b] dark:text-[#fafafa] overflow-hidden">
            <div className="flex gap-2 shrink-0">
                <div className="flex flex-1 border border-[#e4e4e7] dark:border-[#27272a] rounded-md bg-white dark:bg-[#09090b]">
                    <div className="relative border-r border-[#e4e4e7] dark:border-[#27272a]">
                        <button onClick={() => setIsMethodOpen(!isMethodOpen)} className={`h-11 px-4 flex items-center gap-2 font-bold ${methodStyles[method]}`}>
                            {method} <span className="text-[10px] opacity-40">▼</span>
                        </button>
                        {isMethodOpen && (
                            <div className="absolute top-12 left-0 z-50 w-32 bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded-md shadow-xl py-1">
                                {METHODS.map(m => (
                                    <button key={m} onClick={() => { setMethod(m); setIsMethodOpen(false); }} className={`w-full text-left px-4 py-2 font-bold hover:bg-slate-50 dark:hover:bg-white/5 ${methodStyles[m]}`}>{m}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com" className="flex-1 px-4 bg-transparent outline-none" />
                </div>
                <button onClick={handleSend} className={`h-11 px-8 font-bold rounded-md text-white transition-colors ${loading ? "bg-red-600" : "bg-[#2563eb]"}`}>
                    {loading ? "Cancel" : "Send"}
                </button>
            </div>

            <div className="border border-[#e4e4e7] dark:border-[#27272a] rounded-md bg-white dark:bg-[#09090b] flex flex-col h-64 shrink-0">
                <div className="flex border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121212] justify-between items-center pr-4">
                    <div className="flex">
                        {['Params', 'Headers', 'JSON'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-3 text-[12px] font-bold uppercase tracking-wider ${activeTab === t ? "border-b-2 border-blue-600 text-blue-600" : "opacity-50"}`}>{t}</button>
                        ))}
                    </div>
                    {activeTab !== 'JSON' && (
                        <button onClick={() => activeTab === 'Params' ? setParams([...params, { key: "", value: "" }]) : setHeaders([...headers, { key: "", value: "" }])} className="text-[12px] font-bold text-blue-600">+ Add Row</button>
                    )}
                </div>
                <div className="flex-1 overflow-auto p-4">
                    {activeTab === 'JSON' ? <JsonEditor value={jsonBody} onChange={setJsonBody} /> : (
                        <div className="space-y-2">
                            {(activeTab === "Params" ? params : headers).map((row, i) => (
                                <div key={i} className="flex gap-2 items-center group">
                                    <div className="flex flex-1 border border-[#e4e4e7] dark:border-[#27272a] rounded bg-white dark:bg-black overflow-hidden">
                                        <input list={activeTab === 'Headers' ? "header-keys" : ""} value={row.key} onChange={e => updateRow(activeTab === "Params", i, 'key', e.target.value)} placeholder="Key" className="w-full p-2.5 bg-transparent outline-none border-r border-[#e4e4e7] dark:border-[#27272a]" />
                                        <input list={activeTab === 'Headers' ? "header-values" : ""} value={row.value} onChange={e => updateRow(activeTab === "Params", i, 'value', e.target.value)} placeholder="Value" className="w-full p-2.5 bg-transparent outline-none" />
                                    </div>
                                    <button onClick={() => removeRow(activeTab === "Params", i)} className="opacity-0 group-hover:opacity-100 text-red-500 px-2">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col border border-[#e4e4e7] dark:border-[#27272a] rounded-md bg-white dark:bg-[#09090b] overflow-hidden min-h-0 shadow-sm">
                <div className="px-4 py-2 border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121212] flex justify-between items-center text-[12px] font-bold uppercase shrink-0">
                    <span>Response</span>
                    {response && (
                        <div className="flex gap-4 font-mono lowercase">
                            <span className={response.ok ? "text-green-600" : "text-red-600"}>Status: {response.status}</span>
                            <span className="text-blue-600">Time: {response.time}ms</span>
                            <span className="opacity-50">Size: {response.size}kb</span>
                        </div>
                    )}
                </div>
                <pre
                    className="p-4 flex-1 overflow-auto font-mono text-[14px] m-0 text-left align-top bg-white dark:bg-[#09090b] whitespace-pre-wrap wrap-break-words text-slate-600 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: renderOutput() }}
                />
            </div>

            <datalist id="header-keys">{COMMON_HEADERS.map(h => <option key={h} value={h} />)}</datalist>
            <datalist id="header-values">{COMMON_VALUES.map(v => <option key={v} value={v} />)}</datalist>
        </div>
    );
}
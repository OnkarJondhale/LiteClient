import { useState, useEffect } from 'react';
import JsonEditor from "./JsonEditor";
import { METHODS, COMMON_HEADERS, COMMON_VALUES, methodStyles, STATUS_CODES } from "../constants";

export default function ApiMock() {
    const [mocks, setMocks] = useState(() => {
        const saved = sessionStorage.getItem('api_mocks');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                method: 'GET',
                path: 'http://localhost:3000/api/users',
                status: 200,
                headers: [{ key: "Content-Type", value: "application/json" }],
                params: [{ key: "", value: "" }],
                body: ''
            },
        ];
    });

    const [isCopied, setIsCopied] = useState(false);

    const [activeMockId, setActiveMockId] = useState(() => {
        const savedId = sessionStorage.getItem('active_mock_id');
        return savedId ? JSON.parse(savedId) : 1;
    });

    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem('active_mock_tab') || "Params";
    });

    const [isSidebar, setIsSidebar] = useState(true);
    const [isMethodOpen, setIsMethodOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    useEffect(() => {
        const dataToSave = mocks.map(({ id, method, path, status, headers, params, body }) => ({
            id, method, path, status, headers, params, body
        }));
        sessionStorage.setItem('api_mocks', JSON.stringify(dataToSave));
    }, [mocks]);

    useEffect(() => {
        sessionStorage.setItem('active_mock_id', JSON.stringify(activeMockId));
    }, [activeMockId]);

    useEffect(() => {
        sessionStorage.setItem('active_mock_tab', activeTab);
    }, [activeTab]);

    const activeMock = mocks.find(m => m.id === activeMockId) || mocks[0];

    const updateActiveMock = (updatedFields) => {
        setMocks(prev => prev.map(m => m.id === activeMockId ? { ...m, ...updatedFields } : m));
    };

    const updateKVRow = (isParam, idx, field, val) => {
        const list = isParam ? [...activeMock.params] : [...activeMock.headers];
        list[idx] = { ...list[idx], [field]: val };
        updateActiveMock(isParam ? { params: list } : { headers: list });
    };

    const removeRow = (isParam, idx) => {
        const list = isParam ? (activeMock.params || []) : (activeMock.headers || []);
        if (list.length > 1) {
            const next = list.filter((_, i) => i !== idx);
            updateActiveMock(isParam ? { params: next } : { headers: next });
        }
    };

    const addRow = (isParam) => {
        const list = isParam ? [...activeMock.params] : [...activeMock.headers];
        updateActiveMock(isParam ? { params: [...list, { key: "", value: "" }] } : { headers: [...list, { key: "", value: "" }] });
    };

    const copyMockUrl = () => {
        const baseUrl = "http://localhost:9090";
        const path = activeMock.path.startsWith('/') ? activeMock.path : `/${activeMock.path}`;
        navigator.clipboard.writeText(`${baseUrl}${path}`);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className="flex h-full text-[14px] text-[#18181b] dark:text-[#fafafa] bg-white dark:bg-[#09090b] overflow-hidden">
            <div className={`${isSidebar ? 'w-64' : 'w-0'} transition-all border-r border-[#e4e4e7] dark:border-[#27272a] flex flex-col shrink-0 overflow-hidden`}>
                <div className="p-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] flex justify-between items-center whitespace-nowrap">
                    <span className="font-bold text-[10px] uppercase opacity-40">Mocks</span>
                    <button onClick={() => {
                        const id = Date.now();
                        setMocks([...mocks, { id, method: 'GET', path: 'http://localhost:3000/new-api', status: 200, headers: [{ key: "", value: "" }], params: [{ key: "", value: "" }], body: '' }]);
                        setActiveMockId(id);
                    }} className="text-blue-600 font-bold text-lg">+</button>
                </div>
                <div className="flex-1 overflow-auto">
                    {mocks.map((mock) => (
                        <div key={mock.id} onClick={() => setActiveMockId(mock.id)}
                            className={`group p-3 cursor-pointer flex justify-between items-center ${activeMockId === mock.id ? 'bg-zinc-100 dark:bg-white/5' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}`}>
                            <div className="flex gap-2 items-center overflow-hidden">
                                <span className={`text-[10px] font-bold w-8 ${methodStyles[mock.method]}`}>{mock.method}</span>
                                <span className="truncate opacity-70">{mock.path}</span>
                            </div>
                            {mocks.length > 1 && (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    const filtered = mocks.filter(m => m.id !== mock.id);
                                    setMocks(filtered);
                                    if (activeMockId === mock.id && filtered.length > 0) setActiveMockId(filtered[0].id);
                                }} className="opacity-0 group-hover:opacity-100 text-red-500">✕</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 border-b border-[#e4e4e7] dark:border-[#27272a] flex items-center px-4 gap-3 shrink-0">
                    <button onClick={() => setIsSidebar(!isSidebar)} className="text-zinc-500 hover:text-blue-600 transition-colors cursor-pointer">
                        <svg viewBox="-0.5 -0.5 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" height="20" width="20" className={`transition-transform duration-300 ${!isSidebar ? 'rotate-180' : ''}`}>
                            <path d="M12.7769375 14.284625H2.2230625c-0.8326875 0 -1.5076875 -0.675 -1.5076875 -1.5076875l0 -10.553875c0 -0.8326875 0.675 -1.5076875 1.5076875 -1.5076875h10.553875c0.8326875 0 1.5076875 0.675 1.5076875 1.5076875v10.553875c0 0.8326875 -0.675 1.5076875 -1.5076875 1.5076875Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                            <path d="M3.91925 5.9923125 2.6 7.5l1.31925 1.5076875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                            <path d="M5.615375 14.284625V0.715375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
                        </svg>
                    </button>
                    <div className="flex flex-1 border border-[#e4e4e7] dark:border-[#27272a] rounded-md h-10 relative">
                        <div className="relative border-r border-[#e4e4e7] dark:border-[#27272a]">
                            <button onClick={() => setIsMethodOpen(!isMethodOpen)} className={`h-full px-4 font-bold flex items-center gap-2 ${methodStyles[activeMock.method]}`}>
                                {activeMock.method} <span className="text-[10px] opacity-40">▼</span>
                            </button>
                            {isMethodOpen && (
                                <div className="absolute top-11 left-0 z-50 w-32 bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded shadow-xl py-1">
                                    {METHODS.map(m => (
                                        <button key={m} onClick={() => { updateActiveMock({ method: m }); setIsMethodOpen(false); }} className={`w-full text-left px-4 py-2 font-bold hover:bg-zinc-100 dark:hover:bg-white/5 ${methodStyles[m]}`}>{m}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input value={activeMock.path} onChange={e => updateActiveMock({ path: e.target.value })} className="flex-1 px-4 bg-transparent outline-none font-mono" placeholder="/path" />
                    </div>

                    <button
                        onClick={copyMockUrl}
                        className={`h-10 px-4 rounded-md font-bold text-[11px] uppercase transition-all shrink-0 cursor-pointer active:scale-95 ${isCopied
                            ? 'bg-green-600 text-white'
                            : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                            }`}
                    >
                        {isCopied ? 'Copied!' : 'Copy URL'}
                    </button>

                    <div className="relative">
                        <button onClick={() => setIsStatusOpen(!isStatusOpen)} className="h-10 px-4 border border-[#e4e4e7] dark:border-[#27272a] rounded-md font-bold text-green-600">
                            {activeMock.status} <span className="text-[10px] opacity-40">▼</span>
                        </button>
                        {isStatusOpen && (
                            <div className="absolute top-11 right-0 z-50 w-24 bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded shadow-xl py-1 max-h-48 overflow-auto">
                                {STATUS_CODES.map(s => (
                                    <button key={s} onClick={() => { updateActiveMock({ status: s }); setIsStatusOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-white/5 font-bold ${s >= 400 ? 'text-red-500' : 'text-green-500'}`}>{s}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex border-b border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121212] justify-between items-center pr-4 shrink-0">
                    <div className="flex">
                        {['Params', 'Headers', 'Body'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-3 text-[12px] font-bold uppercase tracking-wider ${activeTab === t ? "border-b-2 border-blue-600 text-blue-600" : "opacity-50"}`}>{t}</button>
                        ))}
                    </div>
                    {activeTab !== 'Body' && (
                        <button onClick={() => addRow(activeTab === 'Params')} className="text-[12px] font-bold text-blue-600">+ Add Row</button>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {activeTab === 'Body' ? (
                        <JsonEditor value={activeMock.body} onChange={(val) => updateActiveMock({ body: val })} />
                    ) : (
                        <div className="space-y-2">
                            {(activeTab === "Params" ? activeMock.params : activeMock.headers).map((row, i) => (
                                <div key={i} className="flex gap-2 items-center group">
                                    <div className="flex flex-1 border border-[#e4e4e7] dark:border-[#27272a] rounded overflow-hidden bg-white dark:bg-black">
                                        <input list={activeTab === 'Headers' ? "header-keys" : ""} value={row.key} onChange={e => updateKVRow(activeTab === "Params", i, 'key', e.target.value)} placeholder="Key" className="w-full p-2.5 bg-transparent outline-none border-r border-[#e4e4e7] dark:border-[#27272a]" />
                                        <input list={activeTab === 'Headers' ? "header-values" : ""} value={row.value} onChange={e => updateKVRow(activeTab === "Params", i, 'value', e.target.value)} placeholder="Value" className="w-full p-2.5 bg-transparent outline-none" />
                                    </div>
                                    <button onClick={() => removeRow(activeTab === "Params", i)} className="opacity-0 group-hover:opacity-100 text-red-500 px-2 font-bold transition-opacity">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <datalist id="header-keys">{COMMON_HEADERS.map(h => <option key={h} value={h} />)}</datalist>
            <datalist id="header-values">{COMMON_VALUES.map(v => <option key={v} value={v} />)}</datalist>
        </div>
    );
}
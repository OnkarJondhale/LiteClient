import { useState } from 'react';
import JsonEditor from "./JsonEditor";
import { useApiMock } from "../hooks/useApiMock";
import { METHODS, COMMON_HEADERS, COMMON_VALUES, methodStyles, STATUS_CODES } from "../constants";

function ApiMock() {
    const {
        mocks, activeMock, activeMockId, activeTab, isCopied,
        setActiveTab, setActiveMockId, addMock, removeMock,
        updateActiveMock, updateKVRow, removeRow, addRow, copyMockUrl
    } = useApiMock();

    const [isSidebar, setIsSidebar] = useState(true);
    const [isMethodOpen, setIsMethodOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    if (!activeMock) return null;

    return (
        <div className="flex h-full text-[14px] text-[#18181b] dark:text-[#fafafa] bg-white dark:bg-[#09090b] overflow-hidden">
            <div className={`${isSidebar ? 'w-64' : 'w-0'} transition-all border-r border-[#e4e4e7] dark:border-[#27272a] flex flex-col shrink-0 overflow-hidden`}>
                <div className="p-3.5 border-b border-[#e4e4e7] dark:border-[#27272a] flex justify-between items-center">
                    <span className="font-bold text-[10px] uppercase opacity-40 tracking-widest">Mocks</span>
                    <button onClick={addMock} className="text-blue-600 font-bold text-lg hover:scale-110 cursor-pointer">+</button>
                </div>
                <div className="flex-1 overflow-auto">
                    {mocks.map((mock) => (
                        <div key={mock.id} onClick={() => setActiveMockId(mock.id)}
                            className={`group p-3 cursor-pointer flex justify-between items-center ${activeMockId === mock.id ? 'bg-zinc-100 dark:bg-white/5' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}`}>
                            <div className="flex gap-2 items-center overflow-hidden">
                                <span className={`text-[10px] font-bold w-8 ${methodStyles[mock.method]}`}>{mock.method}</span>
                                <span className={`truncate opacity-70 ${!mock.isActive ? 'opacity-30 line-through' : ''}`}>
                                    {mock.path}
                                </span>
                            </div>
                            {mocks.length > 1 && (
                                <button onClick={(e) => { e.stopPropagation(); removeMock(mock.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">✕</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-14 border-b border-[#e4e4e7] dark:border-[#27272a] flex items-center px-4 gap-3 shrink-0">
                    <button onClick={() => setIsSidebar(!isSidebar)} className="text-zinc-500 hover:text-blue-600 transition-colors cursor-pointer">
                        <svg viewBox="-0.5 -0.5 16 16" fill="none" height="20" width="20" className={`transition-transform duration-300 ${!isSidebar ? 'rotate-180' : ''}`}>
                            <path d="M12.7769375 14.284625H2.2230625c-0.8326875 0 -1.5076875 -0.675 -1.5076875 -1.5076875l0 -10.553875c0 -0.8326875 0.675 -1.5076875 1.5076875 -1.5076875h10.553875c0.8326875 0 1.5076875 0.675 1.5076875 1.5076875v10.553875c0 0.8326875 -0.675 1.5076875 -1.5076875 1.5076875Z" stroke="currentColor" strokeWidth="1"></path>
                            <path d="M3.91925 5.9923125 2.6 7.5l1.31925 1.5076875" stroke="currentColor" strokeWidth="1"></path>
                            <path d="M5.615375 14.284625V0.715375" stroke="currentColor" strokeWidth="1"></path>
                        </svg>
                    </button>

                    <div className="flex flex-1 border border-[#e4e4e7] dark:border-[#27272a] rounded-md h-10 relative bg-zinc-50/50 dark:bg-black/20">
                        <div className="relative border-r border-[#e4e4e7] dark:border-[#27272a]">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsMethodOpen(!isMethodOpen); setIsStatusOpen(false); }} 
                                className={`h-full px-4 font-bold flex items-center gap-2 ${methodStyles[activeMock.method]}`}
                            >
                                {activeMock.method} <span className="text-[10px] opacity-40">▼</span>
                            </button>
                            
                            {isMethodOpen && (
                                <div className="absolute top-11 left-0 z-999 w-32 bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded shadow-2xl py-1">
                                    {METHODS.map(m => (
                                        <button 
                                            key={m} 
                                            onClick={() => { 
                                                updateActiveMock({ method: m }); 
                                                setIsMethodOpen(false); 
                                            }} 
                                            className={`w-full text-left px-4 py-2 font-bold hover:bg-zinc-100 dark:hover:bg-white/5 ${methodStyles[m]}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input 
                            value={activeMock.path} 
                            onChange={e => updateActiveMock({ path: e.target.value })} 
                            className="flex-1 px-4 bg-transparent outline-none font-mono" 
                            placeholder="/path" 
                        />
                    </div>

                    <button onClick={copyMockUrl} className={`h-10 px-4 rounded-md font-bold text-[11px] uppercase transition-all ${isCopied ? 'bg-green-600 text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'}`}>
                        {isCopied ? 'Copied!' : 'Copy URL'}
                    </button>

                    <div className="relative">
                        <button onClick={() => { setIsStatusOpen(!isStatusOpen); setIsMethodOpen(false); }} className="h-10 px-4 border border-[#e4e4e7] dark:border-[#27272a] rounded-md font-bold text-green-600">
                            {activeMock.status} <span className="text-[10px] opacity-40">▼</span>
                        </button>
                        {isStatusOpen && (
                            <div className="absolute top-11 right-0 z-999 w-24 bg-white dark:bg-[#18181b] border border-[#e4e4e7] dark:border-[#27272a] rounded shadow-2xl py-1 max-h-48 overflow-auto">
                                {STATUS_CODES.map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => { updateActiveMock({ status: s }); setIsStatusOpen(false); }} 
                                        className={`w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-white/5 font-bold ${s >= 400 ? 'text-red-500' : 'text-green-500'}`}
                                    >
                                        {s}
                                    </button>
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

                    <div className='flex items-center space-x-6'>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={activeMock.isActive} onChange={(e) => updateActiveMock({ isActive: e.target.checked })} className="sr-only peer" />
                            <div className="relative w-9 h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-xs font-medium text-[#71717a] dark:text-[#a1a1aa] select-none">Activate URL</span>
                        </label>

                        {activeTab !== 'Body' && (
                            <button onClick={() => addRow(activeTab === 'Params')} className="text-[12px] font-bold text-blue-600 hover:text-blue-500 transition-colors">+ Add Row</button>
                        )}
                    </div>
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
                                    <button onClick={() => removeRow(activeTab === "Params", i)} className="opacity-0 group-hover:opacity-100 text-red-500 px-2 font-bold">✕</button>
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

export default ApiMock;
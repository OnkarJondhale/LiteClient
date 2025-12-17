let controller;
const sendBtn = document.getElementById('send-btn');
const urlInput = document.getElementById('url');
const output = document.getElementById('output');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const jsonInput = document.getElementById('json-input');
const beautifyBtn = document.getElementById('beautify-json');
const responseMeta = document.getElementById('response-meta');

const KEY_PREFIX = 'lite-client-';

window.addEventListener('load', () => {
    switchTab(sessionStorage.getItem(`${KEY_PREFIX}activeTab`) || 'params');
    urlInput.value = sessionStorage.getItem(`${KEY_PREFIX}savedUrl`) || '';
    jsonInput.value = sessionStorage.getItem(`${KEY_PREFIX}savedJson`) || '';
    ensureMinRows();
    validateJsonSilently();
    validateUrlState(); 
});

function ensureMinRows() {
    if (document.getElementById('params-list').children.length === 0) createKVRow('params-list');
    if (document.getElementById('headers-list').children.length === 0) createKVRow('headers-list');
}

function validateUrlState() {
    const hasUrl = urlInput.value.trim().length > 0;
    sendBtn.disabled = !hasUrl;
    if (!hasUrl) {
        sendBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        sendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}
urlInput.addEventListener('input', validateUrlState);

function switchTab(tabId) {
    tabPanes.forEach(pane => pane.classList.add('hidden'));
    tabBtns.forEach(btn => btn.classList.remove('border-blue-500', 'text-blue-500'));
    const activePane = document.getElementById(`${tabId}-content`);
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activePane) activePane.classList.remove('hidden');
    if (activeBtn) activeBtn.classList.add('border-blue-500', 'text-blue-500');
    sessionStorage.setItem(`${KEY_PREFIX}activeTab`, tabId);
}
tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

function createKVRow(containerId) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'flex gap-2 kv-row mb-2 group';
    const keyList = containerId === 'headers-list' ? 'list="common-header-keys"' : '';
    const valList = containerId === 'headers-list' ? 'list="common-header-values"' : '';

    div.innerHTML = `
        <input type="text" ${keyList} placeholder="Key" class="kv-key w-1/3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded text-sm outline-none focus:border-blue-500 transition-colors">
        <input type="text" ${valList} placeholder="Value" class="kv-value flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded text-sm outline-none focus:border-blue-500 transition-colors">
        <button class="remove-row text-slate-400 hover:text-red-500 px-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.remove-row').onclick = () => { div.remove(); ensureMinRows(); };
}
document.getElementById('add-param').onclick = () => createKVRow('params-list');
document.getElementById('add-header').onclick = () => createKVRow('headers-list');

function validateJsonSilently() {
    const val = jsonInput.value.trim();
    beautifyBtn.disabled = val.length === 0;
    if (!val) { jsonInput.style.borderLeftColor = "transparent"; return true; }
    try { JSON.parse(val); jsonInput.style.borderLeftColor = "#22c55e"; return true; } 
    catch (e) { jsonInput.style.borderLeftColor = "#ef4444"; return false; }
}
jsonInput.addEventListener('input', validateJsonSilently);

beautifyBtn.onclick = () => {
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonInput.value = JSON.stringify(obj, null, 4);
        validateJsonSilently();
    } catch (e) {}
};

jsonInput.addEventListener('keydown', function(e) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const val = this.value;
    const charAfter = val.charAt(start);

    const closers = ['}', ']', ')', '"', "'"];
    if (closers.includes(e.key) && charAfter === e.key) {
        e.preventDefault();
        this.selectionStart = this.selectionEnd = start + 1;
        return;
    }

    const pairs = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'" };
    if (pairs[e.key]) {
        e.preventDefault();
        const close = pairs[e.key];
        this.value = val.substring(0, start) + e.key + close + val.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    } 

    else if (e.key === 'Tab') {
        e.preventDefault();
        this.value = val.substring(0, start) + "    " + val.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
    
    else if (e.key === 'Enter') {
        e.preventDefault();
        const before = val.substring(0, start);
        const after = val.substring(end);
        const charBefore = before.slice(-1);
        const line = before.split('\n').pop();
        const indent = line.match(/^\s*/)[0];

        if ((charBefore === '{' && charAfter === '}') || (charBefore === '[' && charAfter === ']')) {
            const newIndent = indent + "    ";
            this.value = before + "\n" + newIndent + "\n" + indent + after;
            this.selectionStart = this.selectionEnd = before.length + newIndent.length + 1;
        } else if (charBefore === '{' || charBefore === '[') {
            const newIndent = indent + "    ";
            this.value = before + "\n" + newIndent + after;
            this.selectionStart = this.selectionEnd = before.length + newIndent.length + 1;
        } else {
            this.value = before + "\n" + indent + after;
            this.selectionStart = this.selectionEnd = before.length + indent.length + 1;
        }
    }
    validateJsonSilently();
});

sendBtn.addEventListener('click', async () => {
    if (sendBtn.textContent === 'Cancel') { controller.abort(); return; }
    const currentUrl = urlInput.value.trim();
    if (!currentUrl) return;

    let finalUrl;
    try {
        finalUrl = new URL(currentUrl.startsWith('http') ? currentUrl : `http://${currentUrl}`);
        document.querySelectorAll('#params-list .kv-row').forEach(row => {
            const k = row.querySelector('.kv-key').value;
            const v = row.querySelector('.kv-value').value;
            if (k) finalUrl.searchParams.append(k, v);
        });
    } catch(e) { output.textContent = "// Invalid URL format"; return; }

    const headers = {};
    document.querySelectorAll('#headers-list .kv-row').forEach(row => {
        const k = row.querySelector('.kv-key').value;
        const v = row.querySelector('.kv-value').value;
        if (k) headers[k] = v;
    });

    const method = document.getElementById('method').value;
    const bodyText = jsonInput.value.trim();
    sessionStorage.setItem(`${KEY_PREFIX}savedUrl`, currentUrl);
    sessionStorage.setItem(`${KEY_PREFIX}savedJson`, bodyText);

    controller = new AbortController();
    sendBtn.textContent = 'Cancel';
    sendBtn.classList.replace('bg-blue-600', 'bg-red-600');
    output.textContent = '// Sending...';
    responseMeta.innerHTML = '';
    const startTime = performance.now();

    try {
        const options = { method, headers, signal: controller.signal };
        if (method !== 'GET' && bodyText) options.body = bodyText;
        const response = await fetch(finalUrl.toString(), options);
        const duration = Math.round(performance.now() - startTime);
        const blob = await response.clone().blob();
        const sizeKB = (blob.size / 1024).toFixed(2);

        const statusColor = response.ok ? 'text-green-500' : 'text-red-500';
        responseMeta.innerHTML = `
            <span class="${statusColor}">Status: ${response.status} ${response.statusText}</span> &nbsp;&nbsp;
            <span class="text-slate-500">Time: ${duration}ms</span> &nbsp;&nbsp;
            <span class="text-slate-500">Size: ${sizeKB}KB</span>
        `;

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 4);
        } else {
            const raw = await response.text();
            output.textContent = raw || "// Empty response";
        }
        output.className = "p-4 overflow-auto flex-1 bg-white dark:bg-slate-900 font-mono text-sm text-slate-700 dark:text-slate-300";
    } catch (err) {
        output.textContent = err.name === 'AbortError' ? '// Cancelled' : `// Network Error: ${err.message}`;
        output.className = "p-4 overflow-auto flex-1 bg-white dark:bg-slate-900 font-mono text-sm text-red-500";
    } finally {
        sendBtn.textContent = 'Send';
        sendBtn.classList.replace('bg-red-600', 'bg-blue-600');
        validateUrlState(); 
    }
});
import { useState } from "react";

export default function JsonEditor({ value, onChange }) {
    const [isValid, setIsValid] = useState(true);

    const validate = (val) => {
        if (!val.trim()) return true;
        try {
            JSON.parse(val);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleBeautify = () => {
        try {
            const obj = JSON.parse(value);
            onChange(JSON.stringify(obj, null, 4));
            setIsValid(true);
        } catch (e) {
            setIsValid(false);
        }
    };

    const handleKeyDown = (e) => {
        const target = e.target;
        const { selectionStart: start, selectionEnd: end } = target;
        const charAfter = value.charAt(start);

        const pairs = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'" };
        if (pairs[e.key]) {
            e.preventDefault();
            const newValue = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
            onChange(newValue);
            setTimeout(() => target.setSelectionRange(start + 1, start + 1), 0);
        }

        else if (e.key === 'Tab') {
            e.preventDefault();
            const newValue = value.substring(0, start) + "    " + value.substring(end);
            onChange(newValue);
            setTimeout(() => target.setSelectionRange(start + 4, start + 4), 0);
        }

        else if (e.key === 'Enter') {
            e.preventDefault();
            const before = value.substring(0, start);
            const after = value.substring(end);
            const line = before.split('\n').pop();
            const indent = line.match(/^\s*/)[0];
            const charBefore = before.slice(-1);

            let newValue, newPos;
            if ((charBefore === '{' && charAfter === '}') || (charBefore === '[' && charAfter === ']')) {
                const newIndent = indent + "    ";
                newValue = before + "\n" + newIndent + "\n" + indent + after;
                newPos = before.length + newIndent.length + 1;
            } else if (charBefore === '{' || charBefore === '[') {
                const newIndent = indent + "    ";
                newValue = before + "\n" + newIndent + after;
                newPos = before.length + newIndent.length + 1;
            } else {
                newValue = before + "\n" + indent + after;
                newPos = before.length + indent.length + 1;
            }
            onChange(newValue);
            setTimeout(() => target.setSelectionRange(newPos, newPos), 0);
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-white dark:bg-[#0b0b0b] group overflow-hidden">

            <button
                onClick={handleBeautify}
                className="absolute right-6 top-3 z-20 px-3 py-1.5 text-[11px] font-bold bg-[#2563eb] hover:bg-blue-700 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer active:scale-95"
            >
                Beautify JSON
            </button>

            <div className="flex h-full">

                <div
                    className={`w-1.5 h-full shrink-0 transition-colors duration-300 ${value.trim() === ""
                            ? "bg-slate-200 dark:bg-[#27272a]"
                            : (isValid ? "bg-green-500" : "bg-red-500")
                        }`}
                />

                <textarea
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsValid(validate(e.target.value));
                    }}
                    onKeyDown={handleKeyDown}
                    spellCheck="false"
                    className="w-full h-full p-4 font-mono text-[14px] leading-relaxed outline-none resize-none bg-transparent text-[#18181b] dark:text-[#fafafa] placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    placeholder='{ "example": "data" }'
                />
            </div>
        </div>
    );
}
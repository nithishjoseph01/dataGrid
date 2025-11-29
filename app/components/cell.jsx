import React, { useEffect, useRef, forwardRef } from "react";

const Cell = forwardRef(function Cell(
    {
        value,
        tempValue,
        focused,
        selected,
        onTempChange,
        onCommit,
        onCancel,
        onMouseDown,
        onMouseEnter,
    },
    ref
) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (focused && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [focused]);

    return (
        <div
            ref={ref}
            tabIndex={0}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            className={`p-2 min-w-[100px] text-sm border break-words ${selected ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"
                }`}
            style={{ boxSizing: "border-box" }}
        >
            {focused ? (
                <textarea
                    ref={textareaRef}
                    value={tempValue ?? ""}
                    onChange={(e) => onTempChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onCommit();
                        } else if (e.key === "Escape") {
                            e.preventDefault();
                            onCancel();
                        }
                    }}
                    className="w-full resize-none outline-none bg-transparent"
                    rows={1}
                    style={{ overflow: "hidden" }}
                />
            ) : (
                <pre className="whitespace-pre-wrap break-words m-0">{value ?? ""}</pre>
            )}
        </div>
    );
});

export default Cell;

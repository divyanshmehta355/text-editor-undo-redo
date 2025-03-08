import * as React from "react";
import { useState, useRef, useEffect } from "react";

export default function TextEditor() {
    const [text, setText] = useState<string>("");
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);
    const [undoStackView, setUndoStackView] = useState<string[]>([]);
    const [redoStackView, setRedoStackView] = useState<string[]>([]);

    const undoStackRef = useRef<HTMLDivElement>(null!);
    const redoStackRef = useRef<HTMLDivElement>(null!);

    const updateStacks = () => {
        setUndoStackView([...undoStack.current]);
        setRedoStackView([...redoStack.current]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        undoStack.current.push(text);
        setText(e.target.value);
        redoStack.current = []; // Clear redo stack on new input
        updateStacks();
    };

    const handleUndo = () => {
        if (undoStack.current.length > 0) {
            redoStack.current.push(text);
            setText(undoStack.current.pop() || "");
            updateStacks();
        }
    };

    const handleRedo = () => {
        if (redoStack.current.length > 0) {
            undoStack.current.push(text);
            setText(redoStack.current.pop() || "");
            updateStacks();
        }
    };

    // Scroll to top of a stack
    const scrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    };


    // Add keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                handleUndo();
            }
            if (e.ctrlKey && e.key === "y") {
                e.preventDefault();
                handleRedo();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-900 text-white p-6">
            {/* Text Editor Section */}
            <div className="w-3/5 space-y-4">
                <h2 className="text-xl font-bold text-center">📝 Dark Themed Text Editor</h2>

                <textarea
                    className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    value={text}
                    onChange={handleChange}
                    placeholder="Start typing..."
                />

                <div className="flex space-x-2">
                    <button
                        onClick={handleUndo}
                        disabled={undoStack.current.length === 0}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                    >
                        Undo (Ctrl+Z)
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={redoStack.current.length === 0}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                    >
                        Redo (Ctrl+Y)
                    </button>
                </div>
            </div>

            {/* Stacks Section (Right Side) */}
            <div className="w-2/5 flex flex-col space-y-4 pl-6">
                {/* Undo Stack */}
                <div className="relative p-3 border rounded bg-gray-800 h-64 overflow-auto" ref={undoStackRef}>
                    <div className="sticky top-0 bg-gray-800 py-2 text-lg font-semibold border-b border-gray-700">
                        Undo Stack
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                        {undoStackView.map((item, index) => (
                            <li key={index} className="border-b border-gray-700 py-1 relative">
                                {item || "(empty state)"}
                                {index === undoStackView.length - 1 && (
                                    <button
                                        onClick={() => scrollToTop(undoStackRef)}
                                        className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs shadow-lg"
                                    >
                                        Back to Top ⬆
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Redo Stack */}
                <div className="relative p-3 border rounded bg-gray-800 h-64 overflow-auto" ref={redoStackRef}>
                    <div className="sticky top-0 bg-gray-800 py-2 text-lg font-semibold border-b border-gray-700">
                        Redo Stack
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                        {redoStackView.map((item, index) => (
                            <li key={index} className="border-b border-gray-700 py-1 relative">
                                {item || "(empty state)"}
                                {index === redoStackView.length - 1 && (
                                    <button
                                        onClick={() => scrollToTop(redoStackRef)}
                                        className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs shadow-lg"
                                    >
                                        Back to Top ⬆
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

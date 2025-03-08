import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {motion}  from "motion/react";

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

    const scrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    };


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
        <motion.div className="flex min-h-screen bg-gray-900 text-white p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
        >
            <div className="w-3/5 space-y-4">
                <motion.h2 className="text-xl font-bold text-center"
                           initial={{ opacity: 0, y: -20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5 }}
                >
                    📝 Dark Themed Text Editor
                </motion.h2>

                <motion.textarea
                    className="w-full p-3 border rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    value={text}
                    onChange={handleChange}
                    placeholder="Start typing..."
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                <motion.div className="flex space-x-2">
                    <motion.button onClick={handleUndo} disabled={undoStack.current.length === 0}
                                   className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                                   whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        Undo (Ctrl+Z)
                    </motion.button>
                    <motion.button onClick={handleRedo} disabled={redoStack.current.length === 0}
                                   className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                                   whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        Redo (Ctrl+Y)
                    </motion.button>
                </motion.div>
            </div>

            <div className="w-2/5 flex flex-col space-y-4 pl-6">
                {[{ title: "Undo Stack", stack: undoStackView, ref: undoStackRef }, { title: "Redo Stack", stack: redoStackView, ref: redoStackRef }]
                    .map(({ title, stack, ref }, index) => (
                        <motion.div key={index} className="relative p-3 border rounded bg-gray-800 h-64 overflow-auto" ref={ref}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                        >
                            <div className="sticky top-0 bg-gray-800 py-2 text-lg font-semibold border-b border-gray-700">
                                {title}
                            </div>
                            <ul className="text-sm text-gray-300 space-y-1">
                                {stack.map((item, idx) => (
                                    <motion.li key={idx} className="border-b border-gray-700 py-1 relative"
                                               initial={{ opacity: 0, y: 10 }}
                                               animate={{ opacity: 1, y: 0 }}
                                               transition={{ duration: 0.3 }}
                                    >
                                        {item || "(empty state)"}
                                        {idx === stack.length - 1 && (
                                            <motion.button onClick={() => scrollToTop(ref)}
                                                           className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs shadow-lg"
                                                           whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                Back to Top ⬆
                                            </motion.button>
                                        )}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
            </div>
        </motion.div>
    );
}

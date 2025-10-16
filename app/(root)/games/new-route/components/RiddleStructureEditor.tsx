"use client";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import api from "@/utils/axios";

interface RiddleItem {
    _id?: string;
    no: number;
    gameName: string;
    name: string;
    episode: number | string;
    type: string;
}

interface StructureEditorProps {
    open: boolean;
    onClose: () => void;
    riddles: RiddleItem[];
    onSave: (updatedRiddles: RiddleItem[]) => void;
    gameID: string;
}
interface DraggableRiddleProps {
    riddle: RiddleItem;
    index: number;
    episodeNum: string;
    moveRiddle: (
        fromEp: string,
        toEp: string,
        index: number,
        riddle: RiddleItem
    ) => void;
}

const ItemTypes = {
    RIDDLE: "riddle",
};

const DraggableRiddle: React.FC<DraggableRiddleProps> = ({
    riddle,
    index,
    episodeNum,
    moveRiddle,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: ItemTypes.RIDDLE,
        drop: (item: any) => {
            if (item.sourceEpisode !== episodeNum) {
                moveRiddle(item.sourceEpisode, episodeNum, index, item);
            }
        },
    });

    const [, drag] = useDrag({
        type: ItemTypes.RIDDLE,
        item: { ...riddle, sourceEpisode: episodeNum, index },
    });

    drag(drop(ref)); // <-- Combine safely here

    return (
        <div
            ref={ref}
            className="bg-white p-4 mb-2 rounded border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-grab"
        >
            <div className="flex items-center gap-4">
                <span className="text-gray-400">☰</span>
                <span>{riddle.name}</span>
            </div>
            <span className="text-sm text-gray-500">{riddle.type}</span>
        </div>
    );
};
const EpisodeColumn: React.FC<{
    episodeNum: string;
    riddles: RiddleItem[];
    moveRiddle: (fromEp: string, toEp: string, index: number, riddle: RiddleItem) => void;
}> = ({ episodeNum, riddles, moveRiddle }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.RIDDLE,
        drop: (item: any) => {
            if (item.sourceEpisode !== episodeNum) {
                moveRiddle(item.sourceEpisode, episodeNum, riddles.length, item);
            }
        },
    }));

    // ✅ use callback ref to safely attach drop target
    const setDropRef = (node: HTMLDivElement | null) => {
        if (node) drop(node);
    };

    return (
        <div ref={setDropRef} className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
            {riddles.map((riddle, idx) => (
                <DraggableRiddle
                    key={`${episodeNum}-${riddle._id ?? idx}`}
                    riddle={riddle}
                    index={idx}
                    episodeNum={episodeNum}
                    moveRiddle={moveRiddle}
                />
            ))}
        </div>
    );
};


const RiddleStructureEditor: React.FC<StructureEditorProps> = ({
    open,
    onClose,
    riddles,
    onSave,
    gameID,
}) => {
    const [episodes, setEpisodes] = useState<{ [key: string]: RiddleItem[] }>({});

    useEffect(() => {
        const grouped = riddles.reduce((acc, riddle) => {
            const ep = String(riddle.episode);
            if (!acc[ep]) acc[ep] = [];
            acc[ep].push(riddle);
            return acc;
        }, {} as { [key: string]: RiddleItem[] });

        const sortedEpisodes = Object.fromEntries(
            Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b))
        );
        setEpisodes(sortedEpisodes);
    }, [riddles]);

    const moveRiddle = (fromEp: string, toEp: string, index: number, riddle: RiddleItem) => {
        setEpisodes((prev) => {
            const updated = structuredClone(prev);

            if (!updated[fromEp] || !updated[toEp]) return prev;

            const sourceIndex = updated[fromEp].findIndex((r) => r?._id === riddle?._id);
            if (sourceIndex === -1) return prev;

            // Remove from source
            const [movedRiddle] = updated[fromEp].splice(sourceIndex, 1);

            // ✅ Update its episode number to match destination
            movedRiddle.episode = Number(toEp);

            // Avoid duplicates
            const alreadyExists = updated[toEp].some((r) => r._id === movedRiddle._id);
            if (!alreadyExists) {
                updated[toEp].splice(index, 0, movedRiddle);
            }

            return updated;
        });
    };




    const handleSave = async () => {
        const updatedRiddles = Object.values(episodes).flat();
        try {
            const updates = updatedRiddles.map((r) => ({
                _id: r._id,
                episode: r.episode,
                gameName: gameID,
            }));
            const res = await api.post("/games/update_riddle_episodes", { updates });
            console.log(res.data);
            if (res.data.success) {
                console.log("In if condition", res.data);
                onSave(updatedRiddles);
                onClose();
            }
        } catch (err) {
            console.error("Error updating riddle structure:", err);
        }
    };

    if (!open) return null;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.45)]">
                <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-full max-h-[90vh] flex flex-col">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Edit Route Structure</h2>
                        <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-8 space-y-6">
                        {Object.entries(episodes).map(([episodeNum, riddleList]) => (
                            <div key={episodeNum}>
                                <h3 className="text-lg font-medium mb-3">Episode: {episodeNum}</h3>
                                <EpisodeColumn
                                    episodeNum={episodeNum}
                                    riddles={riddleList}
                                    moveRiddle={moveRiddle}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-2 px-8 py-6 border-t border-gray-200">
                        <button
                            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default RiddleStructureEditor;

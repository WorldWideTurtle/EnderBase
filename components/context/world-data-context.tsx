'use client'

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { projectData } from "@/db/schemes";
import { PostgrestError } from "@supabase/supabase-js";
import { NotificationContext } from "@/components/context/notification-context";
import { ColorsToNumber } from "@/lib/colorUtils";

type pseudoProjectData = projectData & { loaded?: boolean };
export type { pseudoProjectData };

type WorldDataContextType = {
    chestData: pseudoProjectData[];
    tankData: pseudoProjectData[];
    loading: boolean;
    addFrequency: (formData: FormData, isEnderChest: boolean) => void;
    deleteRow: (rowId: number, isEnderChest: boolean) => void;
    getFreeFrequency: (isEnderChest: boolean) => number[];
};

const WorldDataContext = createContext<WorldDataContextType | undefined>(undefined);

export const useWorldDataContext = () => {
    const context = useContext(WorldDataContext);
    if (!context) {
        throw new Error("useWorldDataContext must be used within a WorldDataProvider");
    }
    return context;
};

export const WorldDataProvider = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const [chestData, setChestData] = useState<pseudoProjectData[]>([]);
    const [tankData, setTankData] = useState<pseudoProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const chestFrequencySet = useRef(new Set<number>());
    const tankFrequencySet = useRef(new Set<number>());
    const notificationContext = useContext(NotificationContext);

    useEffect(() => {
        createClient().rpc('get_project_data_by_uuid', { input_uuid: id }).then(e => {
            if (e.error === null) {
                const ChestData = [];
                const TankData = [];
                for (const frequency of e.data) {
                    if (frequency.is_ender_chest) {
                        ChestData.push(frequency);
                        chestFrequencySet.current.add(+frequency.number);
                    } else {
                        TankData.push(frequency);
                        tankFrequencySet.current.add(+frequency.number);
                    }
                }
                setChestData(ChestData);
                setTankData(TankData);
                setLoading(false);
            } else {
                if (e.error.message.includes("NetworkError")) {
                    notificationContext.notify("error", "Failed to retrieve data for this world. Check your internet connection and try again in a moment.");
                } else {
                    notificationContext.notify("error", "Failed to retrieve data for this world.");
                }
            }
        });
    }, [id]);

    const extractInput = (formData: FormData): { color?: number; description?: string; error?: string } => {
        const a = formData.get("a") as string;
        const b = formData.get("b") as string;
        const c = formData.get("c") as string;
        const description = formData.get("description") as string;

        const encodedColor = ColorsToNumber([+a, +b, +c]);
        if (+a > 15 || +b > 15 || +c > 15) return { error: "One of the colors is outside range" };
        if (description === "" || description.length > 48) return { error: "The description has to be between 3 and 48 characters" };
        return {
            color: encodedColor,
            description: description
        };
    };

    const addFrequency = (formData: FormData, isEnderChest: boolean) => {
        const frequencySet = isEnderChest ? chestFrequencySet.current : tankFrequencySet.current;
        const data = isEnderChest ? chestData : tankData;
        const dispatcher = isEnderChest ? setChestData : setTankData;

        const { color, description, error } = extractInput(formData);
        if (error || (color === undefined || description === undefined)) {
            if (error) {
            notificationContext.notify("error", error);
            }
            return;
        }

        if (frequencySet.has(color)) {
            notificationContext.notify("error", "This frequency exists already.");
            return;
        }
        frequencySet.add(color);

        const tempId = performance.now(); // Temporary ID for optimistic UI
        const optimisticRow = { number: color, text_value: description, id: tempId, is_ender_chest: isEnderChest, loaded: false };
        const insertedAt = data.length;
        dispatcher((prev) => [...prev, optimisticRow]);

        createClient().rpc('insert_project_data', {
            input_uuid: id,
            input_number: color,
            input_text_value: description,
            input_is_ender_chest: isEnderChest
        }).then(e => {
            if (e.error) {
                frequencySet.delete(color);
                dispatcher((prev: pseudoProjectData[]) => {
                    return prev.toSpliced(insertedAt, 1);
                });

                if (e.error.message.includes("NetworkError")) {
                    notificationContext.notify("error", "Failed to contact Server. Check your internet connection and try again in a moment.");
                } else {
                    notificationContext.notify("error", "Failed to add frequency.");
                }
            } else {
                notificationContext.notify("success", "Added frequency.");
                const newID = e.data[0].new_id;
                dispatcher((prev: pseudoProjectData[]) => {
                    const dataCopy = [...prev];
                    dataCopy[insertedAt].id = newID;
                    dataCopy[insertedAt].loaded = true;
                    return dataCopy;
                });
            }
        });
    };

    const deleteRow = (rowId: number, isEnderChest: boolean) => {
        const frequencySet = isEnderChest ? chestFrequencySet.current : tankFrequencySet.current;
        const data = isEnderChest ? chestData : tankData;
        const dispatcher = isEnderChest ? setChestData : setTankData;

        let index = data.findIndex((e) => +e.id === rowId);
        let deletedRow = data[index];
        frequencySet.delete(+deletedRow.number);
        dispatcher(data.toSpliced(index, 1));

        createClient().from('project_data').delete().eq('id', rowId).then(e => {
            if (e.error) {
                if (e.error.message.includes("NetworkError")) {
                    notificationContext.notify("error", "Failed to contact Server. Check your internet connection and try again in a moment.");
                } else {
                    notificationContext.notify("error", "Failed to remove frequency.");
                }
                frequencySet.add(+deletedRow.number);
                dispatcher((prev: projectData[]) => {
                    return [
                        ...prev.slice(0, index),
                        deletedRow,
                        ...prev.slice(index + 1)
                    ];
                });
            }
        })
    };

    const getFreeFrequency = (isEnderChest: boolean): number[] => {
        const frequencySet = isEnderChest ? chestFrequencySet.current : tankFrequencySet.current;
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                for (let k = 0; k < 16; k++) {
                    const combination = ColorsToNumber([k, j, i]);
                    if (!frequencySet.has(combination)) {
                        return [k, j, i];
                    }
                }
            }
        }
        return [0, 0, 0];
    };

    return (
        <WorldDataContext.Provider value={{ chestData, tankData, loading, addFrequency, deleteRow, getFreeFrequency }}>
            {children}
        </WorldDataContext.Provider>
    );
};
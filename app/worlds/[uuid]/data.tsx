'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { projectData } from "@/db/schemes";
import { ColorsToNumber, minecraftColors } from "@/lib/colorUtils";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { PostgrestError } from "@supabase/supabase-js";
import { LucidePlus } from "lucide-react";
import { createRef, RefObject, useEffect, useRef, useState } from "react";
import { FrequencyList } from "./frequency-list";
import { Dialog } from "@/components/dialog";
import { createClient } from "@/utils/supabase/client";

type pseudoProjectData = projectData & {loaded?:boolean}
export type { pseudoProjectData }

export function Data({ id } : {id : string}) {
    const [chestData, setChestData] : [pseudoProjectData[],Function] = useState([]);
    const [tankData, setTankData] : [pseudoProjectData[],Function] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedColors, setSelectedColors] = useState([0,0,0])

    const dialogModal : RefObject<HTMLDialogElement | null> = useRef(null)

    const colorInputRefs : RefObject<null | HTMLInputElement>[] = (new Array(48)).fill(0).map(e=>createRef())
    const isOnEnderChestTab : RefObject<boolean> = useRef(true);

    const chestFrequencySet : RefObject<Set<number>> = useRef(new Set())
    const tankFrequencySet : RefObject<Set<number>> = useRef(new Set())
    const dataFetchError : RefObject<PostgrestError | null> = useRef(null)

    useEffect(() => {
        // Fetch project data on load
        createClient().rpc('get_project_data_by_uuid', { input_uuid: id}).then(e=>{
            if (e.error === null) {
                const ChestData = [];
                const TankData = [];
                for (const frequency of e.data) {
                    if (frequency.is_ender_chest) {
                        ChestData.push(frequency)
                        chestFrequencySet.current.add(+frequency.number)
                    } else {
                        TankData.push(frequency)
                        tankFrequencySet.current.add(+frequency.number)
                    }
                }
                setChestData(ChestData);
                setTankData(TankData);
                setLoading(false);
            } else {
                dataFetchError.current = e.error;
                console.error(e.error.message)
            }
        });
    }, [id]);

    function ExtractInput(formData: FormData) : {color?: number, description?:string, error?:string} {
        const a = formData.get("a") as string
        const b = formData.get("b") as string
        const c = formData.get("c") as string
        const description = formData.get("description") as string
        
        const encodedColor = ColorsToNumber([+a,+b,+c])
        if (+a > 15 || +b > 15 || +c > 15) return {error:"Error, one of the colors is outside range"};
        if (description === "" || description.length > 48) return {error:"Error, the description has to be between 3 and 48 characters"};
        return {
            color:encodedColor,
            description:description
        }
    }

    function AddFrequency(formData: FormData) {
        const isEnderChest = isOnEnderChestTab.current;
        const frequencySet = isEnderChest ? chestFrequencySet.current : tankFrequencySet.current;
        const data = isEnderChest ? chestData : tankData;
        const dispatcher = isEnderChest ? setChestData : setTankData;

        const {color, description, error} = ExtractInput(formData);
        if (error || (color === undefined || description === undefined)) return;

        if (frequencySet.has(color)) return;
        frequencySet.add(color)

        const tempId = `temp-${Math.random()}`; // Temporary ID for optimistic UI
        const optimisticRow = { number: color, text_value:description, id: tempId, is_ender_chest:isEnderChest, loaded: false };
        const insertedAt = data.length;
        dispatcher([...data, optimisticRow])

        createClient().rpc('insert_project_data', { 
            input_uuid: id, 
            input_number: color, 
            input_text_value: description, 
            input_is_ender_chest: isEnderChest
        }).then(e=>{
            if (e.error) {
                frequencySet.delete(color);
                dispatcher((prev : pseudoProjectData[]) => {
                    return prev.toSpliced(insertedAt,1);
                });
            } else {
                const newID = e.data[0].new_id;
                dispatcher((prev : pseudoProjectData[]) => {
                    const dataCopy = [...prev];
                    dataCopy[insertedAt].id = newID;
                    dataCopy[insertedAt].loaded = true;
                    return dataCopy
                });
            }
        });

        CloseDialog();
    }

    function DeleteRow(rowId : number) {
        const isEnderChest = isOnEnderChestTab.current;
        const frequencySet = isEnderChest ? chestFrequencySet.current : tankFrequencySet.current;
        const data = isEnderChest ? chestData : tankData;
        const dispatcher = isEnderChest ? setChestData : setTankData;

        let index = data.findIndex((e)=>+e.id === rowId);
        let deletedRow = data[index];
        frequencySet.delete(+deletedRow.number)
        dispatcher(data.toSpliced(index,1));

        createClient().from('project_data').delete().eq('id', rowId).then(e=>{
            if (e.error) {
                frequencySet.add(+deletedRow.number)
                dispatcher((prev : projectData[]) => {
                    return [
                        ...prev.slice(0,index),
                        deletedRow,
                        ...prev.slice(index+1)
                    ]
                });
            } 
        });
    }

    function OpenDialog() {
        dialogModal.current?.showModal();
    }

    function CloseDialog() {
        dialogModal.current?.close();
    }

    function GetFreeFrequency() {
        const frequencySet = isOnEnderChestTab.current ? chestFrequencySet.current : tankFrequencySet.current;
        
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                for (let k = 0; k < 16; k++) {
                    const combination = ColorsToNumber([k,j,i]);
                    if (frequencySet.has(combination)) continue;

                    setSelectedColors([k,j,i])
                    return;
                }
            }
        }
    }

    function OnTabChange(value: string) {
        isOnEnderChestTab.current = value === "chests";
    }

    
    return (
        <>
            <Dialog ref={dialogModal} title="Add Frequency">
                <form action={AddFrequency} className="mt-8 flex flex-col gap-4">
                    <div>
                        <div className="flex justify-between">
                            <Label>Colors</Label>
                            <Button variant={"link"} className="p-0 h-fit opacity-85" onClick={GetFreeFrequency}>Generate free</Button>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-1">
                            {["a","b","c"].map((group,groupIndex)=>(
                                <ul key={group} className="grid grid-rows-1 max-md:grid-rows-2 grid-flow-col border border-input max-md:gap-1">
                                    {minecraftColors.map((color,colorIndex)=>(
                                        <li key={group + colorIndex} className="size-6 aspect-square">
                                            <Input ref={colorInputRefs[groupIndex * 16 + colorIndex]} name={group} id={group + colorIndex} type="radio" value={colorIndex} className="hidden peer" defaultChecked={selectedColors[groupIndex] === colorIndex} required/>
                                            <Label htmlFor={group + colorIndex} className="size-full inline-block hover:outline hover:outline-1 hover:relative peer-checked:outline-2 peer-checked:outline peer-checked:relative" style={{
                                                background: color
                                            }}></Label>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                    <Input name="description" type="text" placeholder="Description"/>
                    <Button type="submit" className="mt-4">Add</Button>
                </form>
            </Dialog>
            <Root defaultValue="chests" onValueChange={OnTabChange}>
                <List aria-label="Switch display" className="pb-6 flex">
                    <Trigger value="chests" className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                        Ender-Chests
                    </Trigger>
                    <Trigger value="tanks" className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                        Ender-Tanks
                    </Trigger>
                </List>
                <Content value="chests">
                    <div className="flex justify-between items-end">
                        <h3 className="text-2xl">Frequencies</h3>
                        <Button title="Add new Frequency" onClick={OpenDialog} variant={"default"} disabled={loading}>Add new <LucidePlus /></Button>
                    </div>
                    <div className="flex flex-col mt-2">
                        {loading ? 
                            <Skeleton /> : 
                            dataFetchError.current === null ? 
                                chestData.length > 0 ? 
                                    <FrequencyList data={chestData} onClick={DeleteRow}/> : 
                                    <p className="opacity-70 text-sm w-full text-center">None yet, start by adding one</p> : 
                                <div>Error loading frequencies</div>}
                    </div>
                </Content>
                <Content value="tanks">
                    <div className="flex justify-between items-end">
                        <h3 className="text-2xl">Frequencies</h3>
                        <Button title="Add new Frequency" onClick={OpenDialog} variant={"default"} disabled={loading}>Add new <LucidePlus /></Button>
                    </div>
                    <div className="flex flex-col mt-2">
                        {loading ? 
                            <Skeleton /> : 
                            dataFetchError.current === null ? 
                                tankData.length > 0 ? 
                                    <FrequencyList data={tankData} onClick={DeleteRow}/> : 
                                    <p className="opacity-70 text-sm w-full text-center">None yet, start by adding one</p> : 
                                <div>Error loading frequencies</div>}
                    </div>
                </Content>
            </Root>
        </>
    )
}



function Skeleton() {
    return [1,2,3].map(e=>(
        <div key={e} className="flex justify-between py-1">
            <div className="grid-cols-[auto_1fr] grid items-center gap-4 animate-pulse w-full">
                <div className="flex gap-1">
                    <span className="size-4 rounded-sm bg-input"></span>
                    <span className="size-4 rounded-sm bg-input"></span>
                    <span className="size-4 rounded-sm bg-input"></span>
                </div>
                <h4 className="h-5 w-full text-xl bg-input text-transparent">Loading</h4>
            </div>
        </div>
    ))
}
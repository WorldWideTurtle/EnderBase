'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { projectData } from "@/db/schemes";
import { minecraftColors } from "@/lib/colorUtils";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { createRef, RefObject, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useWorldDataContext } from "@/components/context/world-data-context";
import { FrequencyDisplay } from "@/components/page-specific/world/frequency-display";

type pseudoProjectData = projectData & {loaded?:boolean}
export type { pseudoProjectData }

export function Data() {
    const {
        chestData,
        tankData,
        addFrequency,
        getFreeFrequency
    } = useWorldDataContext();

    const dialogModal : RefObject<HTMLDialogElement | null> = useRef(null)

    const colorInputRefs : RefObject<null | HTMLInputElement>[] = (new Array(48)).fill(0).map(e=>createRef())
    const isOnEnderChestTab : RefObject<boolean> = useRef(true);

    function OpenDialog() {
        internalGetNextFrequncy()
        dialogModal.current?.showModal();
    }

    function CloseDialog() {
        dialogModal.current?.close();
    }

    function OnTabChange(value: string) {
        isOnEnderChestTab.current = value === "chests";
    }

    const internalAddFrequency = (formdata: FormData) => {
        addFrequency(formdata, isOnEnderChestTab.current);
        CloseDialog();
    }

    const internalGetNextFrequncy = () => {
        const freeFrequency = getFreeFrequency(isOnEnderChestTab.current);

        colorInputRefs.forEach((ref, index) => {
            if (!ref.current) return;

            if (index === freeFrequency[0] || (index === freeFrequency[1] + 16) || (index === freeFrequency[2] + 32)) {
                ref.current.checked = true;
            } else {
                ref.current.checked = false;
            }
        })
    };
    
    return (
        <>
            <Dialog ref={dialogModal} title="Add Frequency">
                <form action={internalAddFrequency} className="mt-8 flex flex-col gap-4">
                    <div>
                        <div className="flex justify-between items-center">
                            <Label>Colors</Label>
                            <Button variant={"ghost"} type="button" className="p-1 h-fit opacity-85" onClick={internalGetNextFrequncy}>Generate free</Button>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-1">
                            {["a","b","c"].map((group,groupIndex)=>(
                                <ul key={group} aria-label={"Choose color " + group} className="grid grid-rows-1 max-md:grid-rows-2 grid-flow-col border border-input max-md:gap-1">
                                    {minecraftColors.map((color,colorIndex)=>(
                                        <li key={group + colorIndex} className="size-6 aspect-square overflow-hidden">
                                            <Input ref={colorInputRefs[groupIndex * 16 + colorIndex]} aria-label={color[1]} name={group} id={group + colorIndex} type="radio" value={colorIndex} className="hidden peer" required/>
                                            <Label htmlFor={group + colorIndex} className="size-full inline-block hover:outline hover:outline-1 hover:relative peer-checked:outline-2 peer-checked:outline peer-checked:relative" style={{
                                                background: color[0]
                                            }}></Label>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                    <Input name="description" type="text" placeholder="Description" aria-label="Frequency description"/>
                    <Button type="submit" className="mt-4">Add Frequency</Button>
                </form>
            </Dialog>
            <Root defaultValue="chests" onValueChange={OnTabChange}>
                <List aria-label="Switch display" className="pb-6 flex">
                    {["chests","tanks"].map(e=>(
                        <Trigger key={e} value={e} className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                            {e === "chests" ? "Ender-Chests" : "Ender-Tanks"}
                        </Trigger>
                    ))}
                </List>
                {["chests","tanks"].map(e=>(
                    <Content value={e} key={e}>
                        <FrequencyDisplay data={e === "chests" ? chestData : tankData} OpenDialog={OpenDialog} isEnderChestTab={e === "chests"}></FrequencyDisplay>
                    </Content>
                ))}
            </Root>
        </>
    )
}

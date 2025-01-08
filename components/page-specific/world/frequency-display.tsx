import { pseudoProjectData, useWorldDataContext } from "@/components/context/world-data-context";
import { Button } from "@/components/ui/button";
import { DBConfig } from "@/db/settings";
import { LucidePlus } from "lucide-react";
import { FrequencyList } from "./frequency-list";

export function FrequencyDisplay({data,OpenDialog,isEnderChestTab}:{data:pseudoProjectData[], OpenDialog:()=>void,isEnderChestTab:boolean}) {
    const {
        loading,
        deleteRow,
    } = useWorldDataContext();

    const internalDeleteRow = (index: number) => {
        deleteRow(index, isEnderChestTab);
    }

    return (
        <>
            <div className="flex justify-between items-end">
                <h3 className="text-2xl">Frequencies</h3>
                <Button title="Add new Frequency" onClick={OpenDialog} variant={"default"} disabled={loading || data.length >= DBConfig.maxFrequencies}>
                    {data.length >= DBConfig.maxFrequencies ? "Max reached" : <>Add new <LucidePlus /></>}
                </Button>
            </div>
            <div className="flex flex-col mt-2">
                {loading ? 
                    <Skeleton /> : 
                    data.length > 0 ? 
                        <FrequencyList data={data} onClick={internalDeleteRow}/> : 
                        <p className="opacity-70 text-sm w-full text-center">None yet, start by adding one</p>}
            </div>
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
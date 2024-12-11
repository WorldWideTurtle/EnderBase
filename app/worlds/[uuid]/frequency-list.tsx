import { Button } from "@/components/ui/button";
import { pseudoProjectData } from "./data";
import { CreateColorSwatches } from "@/lib/colorUtils";
import { LucideTrash } from "lucide-react";

type FrequencyProps = {
    data : pseudoProjectData[];
    onClick : (arg0 : number) => void;
}

export function FrequencyList({data, onClick} : FrequencyProps) {
    return (
        data.map(e=>(
            <div key={e.number} className="flex justify-between gap-1 p-1 hover:bg-input/50 rounded-md" style={{
                opacity: e.loaded === false ? .5 : 1
            }}>
                <div className="grid-cols-[auto_1fr] grid items-center gap-4">
                    <div className="flex gap-1">
                        {CreateColorSwatches(+e.number)}
                    </div>
                    <h4 className="text-xl text-ellipsis">{e.text_value}</h4>
                </div>
                <Button variant={"ghost"} className="p-0 aspect-square" disabled={e.loaded === false ? true : false} onClick={()=>{onClick(+e.id)}}><LucideTrash className="text-destructive" /></Button>
            </div>
        ))
    )
}
import { Button } from "@/components/ui/button";
import { pseudoProjectData } from "../../../app/worlds/[uuid]/data";
import { CreateColorSwatches } from "@/lib/colorUtils";
import { LucideTrash } from "lucide-react";

type FrequencyProps = {
    data : pseudoProjectData[];
    onClick : (arg0 : number) => void;
}

export function FrequencyList({data, onClick} : FrequencyProps) {
    return (
        data.map(e=>(
            <div key={e.number} className="flex justify-between gap-1 p-1 hover:bg-input/50 rounded-md group" style={{
                opacity: e.loaded === false ? .5 : 1
            }}>
                <div className="grid-cols-[auto_1fr] grid items-center gap-4">
                    <div className="flex gap-1">
                        {CreateColorSwatches(e.number)}
                    </div>
                    <h4 className="text-xl text-ellipsis">{e.text_value}</h4>
                </div>
                <Button variant={"ghost"} size={"icon"} disabled={e.loaded === false ? true : false} onClick={()=>{onClick(e.id)}}><LucideTrash className="text-destructive opacity-0 group-hover:!opacity-100" /></Button>
            </div>
        ))
    )
}
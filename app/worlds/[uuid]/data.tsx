'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { projectData } from "@/db/schemes";
import { ColorsToNumber, CreateColorSwatches, minecraftColors } from "@/lib/colorUtils";
import { LucidePlus, LucideTrash } from "lucide-react";
import { MouseEvent, RefObject, useEffect, useRef, useState } from "react";

export function Data({ id } : {id : string}) {
    const [projectData, setProjectData] : [projectData[],Function] = useState([]);
    const [loading, setLoading] = useState(true);

    const dialogModal : RefObject<HTMLDialogElement | null> = useRef(null)

    useEffect(() => {
        // Fetch project data on load
        fetch(`/api/worlds/${id}`)
        .then((res) => res.json())
        .then((data) => {
            setProjectData(data);
            setLoading(false);
        })
        .catch((err) => console.error(err));
    }, [id]);

    function AddRow(formData : FormData) {
        const a = formData.get("a") as string
        const b = formData.get("b") as string
        const c = formData.get("c") as string
        const description = formData.get("description") as string
        
        const encodedColor = ColorsToNumber([+a,+b,+c])
        if (description === "" || description.length > 48) return;

        const tempId = `temp-${Math.random()}`; // Temporary ID for optimistic UI
        const optimisticRow = { number: encodedColor,text_value:description, id: tempId };
        const insertedAt = projectData.length;
        setProjectData([...projectData, optimisticRow]);

        fetch(`/api/worlds/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({row : {input_number:encodedColor, input_text_value:description}})
        }).then(e=>{
            if (e.ok) {
                e.json().then(js => {
                    const newID = js[0].new_id;
                    setProjectData((prev : projectData[]) => {
                        const dataCopy = [...prev];
                        dataCopy[insertedAt].id = newID;
                        return dataCopy
                    });
                })
            }
        })
    }

    function DeleteRow(rowId : number) {
        let index = projectData.findIndex((e)=>+e.id === rowId);
        let deletedRow = projectData[index];
        setProjectData(projectData.toSpliced(index,1));

        fetch(`/api/worlds/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({rowId : rowId})
        }).then(e=>{
            if (!e.ok) {
                setProjectData(
                    [
                        ...projectData.slice(0,index),
                        deletedRow,
                        ...projectData.slice(index+1)
                    ]
                );
            }
        })
    }

    function OpenDialog() {
        dialogModal.current?.showModal();
    }

    function CloseDialog() {
        dialogModal.current?.close();
    }

    function CheckDialogBounds(e : MouseEvent) {
        if (dialogModal.current === null) return;
        const rect = dialogModal.current.getBoundingClientRect();
        if (
            e.clientX < rect.left || 
            e.clientX > rect.right || 
            e.clientY < rect.top || 
            e.clientY > rect.bottom
        ) {
            CloseDialog()
        }
    }

    return (
        <div>
            <dialog ref={dialogModal} onClick={CheckDialogBounds} className="backdrop:backdrop-blur-none backdrop:backdrop-brightness-50 p-2 rounded-lg">
                <div className="flex justify-between">
                    <h2>Add Frequency</h2>
                    <Button onClick={CloseDialog} className="size-6 aspect-square overflow-hidden p-px" variant={"ghost"}><LucidePlus className="rotate-45 hover:text-red-500"/></Button>
                </div>
                <form action={AddRow} className="mt-8 flex flex-col gap-4">
                    <div>
                        <div className="flex justify-between">
                            <Label>Colors</Label>
                            <Button variant={"link"} className="p-0 h-fit">Generate free</Button>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-1">
                            {["a","b","c"].map(group=>(
                                <ul key={group} className="grid grid-rows-1 max-sm:grid-rows-2 grid-flow-col border border-input">
                                    {minecraftColors.map((color,i)=>(
                                        <li key={group + i} className="size-6 aspect-square">
                                            <Input name={group} id={group + i} type="radio" value={i} className="hidden peer" defaultChecked={i === 0}/>
                                            <Label htmlFor={group + i} className="size-full inline-block hover:outline hover:outline-1 hover:relative peer-checked:outline-2 peer-checked:outline peer-checked:relative" style={{
                                                background: color
                                            }}></Label>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                    <Input name="description" type="text" placeholder="Description" />
                    <Button type="submit" className="mt-4">Add</Button>
                </form>
            </dialog>
            <div className="flex justify-between">
                <h3 className="text-2xl">Frequencies</h3>
                <Button title="Add new Frequency" onClick={OpenDialog} variant={"default"} disabled={loading}>Add new <LucidePlus /></Button>
            </div>
            <div className="flex flex-col mt-1 divide-y-2 divide-zinc-800">
                {loading ? <Skeleton /> : projectData ? projectData.length > 0 ? projectData.map(e=>(
                    <div key={e.number} className="flex justify-between py-1">
                        <div className="grid-cols-[auto_1fr] grid items-center gap-4">
                            <div className="flex gap-1">
                                {CreateColorSwatches(+e.number)}
                            </div>
                            <h4 className="text-xl">{e.text_value}</h4>
                        </div>
                        <Button variant={"ghost"} className="p-0 aspect-square" onClick={()=>DeleteRow(+e.id)}><LucideTrash className="text-destructive" /></Button>
                    </div>
                )) : <div className="w-full text-center">None yet, start by adding one</div> : <div>Error loading frequencies</div>}
            </div>
        </div>
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
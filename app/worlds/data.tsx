'use client'

import { RefObject, useEffect, useRef, useState } from "react";
import { World } from "@/components/world";
import { project } from "@/db/schemes";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/dialog";



export function Data() {
    const [projectData, setProjectData] : [project[], Function] = useState([]);
    const [loading, setLoading] = useState(true);

    const dialogModal : RefObject<HTMLDialogElement | null> = useRef(null)
    
    useEffect(() => {
        // Fetch project data on load
        fetch(`/api/worlds/`)
        .then((res) => res.json())
        .then((data) => {
            setProjectData(data);
            setLoading(false);
        })
        .catch((err) => console.error(err));
    }, []);

    function OpenDialog() {
        dialogModal.current?.showModal();
    }

    function CloseDialog() {
        dialogModal.current?.close();
    }

    function AddWorld(formData : FormData) {
        const name = formData.get("name") as string

        if (name === "") return;
        const tempId = `temp-${Math.random()}`; // Temporary ID for optimistic UI
        const optimisticRow = { project_name:name, project_uuid:"", id: tempId };
        const insertedAt = projectData.length;
        setProjectData([...projectData, optimisticRow]);

        fetch(`/api/worlds/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:name})
        }).then(e=>{
            if (e.ok) {
                e.json().then(js => {
                    const newID = js.project_uuid;
                    setProjectData((prev : project[]) => {
                        const dataCopy = [...prev];
                        dataCopy[insertedAt].project_uuid = newID;
                        return dataCopy
                    });
                })
            } else {
                setProjectData((prev : project[]) => {
                    return prev.toSpliced(insertedAt,1);
                });
            }
        })
        CloseDialog();
    }

    return (
        <>
            <Dialog ref={dialogModal} title="Add world">
                <form action={AddWorld} className="mt-8 flex flex-col gap-4">
                    <Input 
                        name="name" 
                        type="text" 
                        placeholder="Name" 
                        required
                        minLength={4}
                        maxLength={47}
                    />
                    <Button type="submit" className="mt-4">Add</Button>
                </form>
            </Dialog>
            <div className="flex justify-between items-end">
                <h3 className="text-2xl">Your worlds</h3>
                <Button title="Add new Frequency" onClick={OpenDialog} variant={"default"} disabled={loading}>Add new <LucidePlus /></Button>
            </div>
            <div className="grid grid-cols-3 grid-flow-row auto-rows-fr gap-2 mt-2">
                {loading ? <Skeleton /> : projectData ? projectData.map(e=>(
                    <World key={e.project_name} project={e}/>
                )) : <div>Failed to load worlds</div>}
            </div>
        </>
    )
}

function Skeleton() {
    return [1,2,3].map(e=>(
        <div key={e} className="h-14 w-full bg-input animate-pulse rounded-lg"></div>
    ))
}
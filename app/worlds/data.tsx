'use client'

import { RefObject, useEffect, useRef, useState } from "react";
import { World } from "@/components/world";
import { project } from "@/db/schemes";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/dialog";
import { createClient } from "@/utils/supabase/client";

type pseudoProject = project & {loaded? : boolean}

export function Data() {
    const [projectData, setProjectData] : [pseudoProject[], Function] = useState([]);
    const [loading, setLoading] = useState(true);

    const dialogModal : RefObject<HTMLDialogElement | null> = useRef(null)
    
    useEffect(() => {
        createClient().from("projects").select("project_uuid,project_name").then(e=>{
            if (e.error === null) {
                setProjectData(e.data);
                setLoading(false);
            } else {
                throw new Error(e.error.message)
            }
        });
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
        const optimisticRow = { project_name:name, project_uuid:"", id: tempId, loaded:false };
        const insertedAt = projectData.length;
        setProjectData([...projectData, optimisticRow]);

        createClient().from("projects").insert({project_name:name}).select().single().then(e=>{
            if (e.error) {
                setProjectData((prev : pseudoProject[]) => {
                    return prev.toSpliced(insertedAt,1);
                });
            } else {
                const newID = e.data.project_uuid;
                    setProjectData((prev : pseudoProject[]) => {
                        const dataCopy = [...prev];
                        dataCopy[insertedAt].project_uuid = newID;
                        dataCopy[insertedAt].loaded = true;
                        return dataCopy
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
                    <World key={e.project_uuid} project={e} loaded={e.loaded ?? true}/>
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
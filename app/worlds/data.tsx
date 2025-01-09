'use client'

import { memo, RefObject, useContext, useEffect, useRef, useState } from "react";
import { World } from "@/components/page-specific/worlds/world";
import { project } from "@/db/schemes";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { MemoizedWorldIcon, WorldIconColors } from "@/components/world-icon";
import { NotificationContext } from "@/components/context/notification-context";
import { DBConfig } from "@/db/settings";


type pseudoProject = project & {loaded? : boolean}

export function Data() {
    const [projectData, setProjectData] : [pseudoProject[], Function] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);

    const dialogModal : RefObject<HTMLDialogElement | null> = useRef(null)

    const notificationContext = useContext(NotificationContext);

    useEffect(() => {
        createClient().from("projects").select("project_uuid,project_name,icon_id").then(e=>{
            if (e.error === null) {
                setProjectData(e.data);
                setLoading(false);
            } else {
                if (e.error.message.includes("NetworkError")) {
                    notificationContext.notify("error","Failed to contact Server. Check your internet connection and try again in a moment.")
                } else {
                    notificationContext.notify("error","Failed to load worlds.")
                }
            }
        });
    }, []);

    function OpenDialog() {
        dialogModal.current?.showModal();
    }

    function CloseDialog() {
        dialogModal.current?.close();
    }

    function AddWorld(formData : FormData, icon: number) {
        const name = formData.get("name") as string

        if (name === "") {
            notificationContext.notify("error","The world name can't be empty.");
            return;
        };
        const tempId = `temp-${Math.random()}`;
        const optimisticRow = { project_name:name, project_uuid:"", id: tempId, loaded:false, icon_id:icon };
        const insertedAt = projectData.length;
        setProjectData([...projectData, optimisticRow]);

        createClient().from("projects").insert({project_name:name,icon_id:icon}).select().single().then(e=>{
            if (e.error) {
                if (e.error.message.includes("NetworkError")) {
                    notificationContext.notify("error","Failed to create world. Check your internet connection and try again in a moment.")
                } else {
                    notificationContext.notify("error","Failed to create world. Note that you can only have " + DBConfig.maxProjects + " personal worlds.")
                }
                setProjectData((prev : pseudoProject[]) => {
                    return prev.toSpliced(insertedAt,1);
                });
            } else {
                notificationContext.notify("success","Created new world.")
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
                <AddWorldForm formSubmitAction={AddWorld}></AddWorldForm>
            </Dialog>
            <div className="flex justify-between items-end">
                <h3 className="text-2xl">Your worlds</h3>
                <Button title="Add new World" onClick={OpenDialog} variant={"default"} disabled={loading}>Add new <LucidePlus /></Button>
            </div>
            <ul className="grid lg:grid-cols-3 sm:grid-cols-2 grid-flow-row auto-rows-fr gap-2 mt-2" aria-label="Your worlds">
                {loading ? <Skeleton /> : <MemoizedWorldsDisplayList projectData={projectData}></MemoizedWorldsDisplayList>}
            </ul>
        </>
    )
}

function AddWorldForm({formSubmitAction}:{formSubmitAction:(formData:FormData, icon: number)=>void}) {
    const [icon, setIcon] = useState<number>(0);

    const submitAction = (formData:FormData) => {
        formSubmitAction(formData, icon);
    }

    return (
        <form action={submitAction} className="mt-8 flex flex-col gap-4">
            <WorldIconList onClick={setIcon} selected={icon}></WorldIconList>
            <label htmlFor="name" className="sr-only">World name</label>
            <div className="flex w-full items-center gap-2">
                <MemoizedWorldIcon iconIndex={icon}></MemoizedWorldIcon>
                <Input 
                    id="name"
                    name="name" 
                    type="text" 
                    placeholder="Name" 
                    required
                    minLength={3}
                    maxLength={48}
                    autoComplete="off"
                />
            </div>
            <Button type="submit" className="mt-4">Add</Button>
        </form>
    )
}

function WorldIconList({onClick, selected}:{onClick?:(icon:number)=>void, selected:number}) {
    return (
        <ul className="grid w-full md:grid-cols-6 lg:grid-cols-7 grid-cols-4 p-2 overflow-y-scroll gap-1 h-32 md:h-40">
            {WorldIconColors.map((e,i)=>{
                if (selected === i) {
                    return (
                        <li key={i}>
                            <MemoizedWorldIcon onClick={onClick} className="group size-full cursor-pointer" style={{strokeWidth:"40px"}} iconIndex={i}></MemoizedWorldIcon>
                        </li>
                    )
                } else {
                    return (
                        <li key={i}>
                            <MemoizedWorldIcon onClick={onClick} className="group size-full cursor-pointer" iconIndex={i}></MemoizedWorldIcon> 
                        </li>
                    )
                }
            })}
        </ul>
    )
}

function Skeleton() {
    return [1,2,3,4,5].map(e=>(
        <li key={e} className="h-14 w-full bg-input animate-pulse rounded-lg"></li>
    ))
}

function WorldsDisplayList({projectData}:{projectData:pseudoProject[]}) {
    if (projectData.length == 0) {
        return <p className="opacity-70 text-sm">No worlds. Make or join one to get started</p>
    }

    return (
        projectData.map(e=>(
            <li key={e.project_uuid}>
                <World project={e} loaded={e.loaded ?? true}/>
            </li>
        ))
    )
}

const MemoizedWorldsDisplayList = memo(WorldsDisplayList);
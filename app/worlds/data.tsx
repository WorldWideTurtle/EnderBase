'use client'

import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { World } from "@/components/world";
import { project } from "@/db/schemes";
import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/dialog";
import { createClient } from "@/utils/supabase/client";
import { WorldIconColors } from "@/components/world-icon";
import dynamic from 'next/dynamic'
import { NotificationContext } from "@/components/notification-context";
import { DBConfig } from "@/db/settings";
 
const WorldIcon = dynamic(() => import('@/components/world-icon'), {
  ssr: false,
})


type pseudoProject = project & {loaded? : boolean}

export function Data() {
    const [projectData, setProjectData] : [pseudoProject[], Function] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [icon, setIcon] = useState<number>(0);

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
                }
            }
        });
    }, []);

    function OpenDialog() {
        setIcon(0);
        dialogModal.current?.showModal();
    }

    function CloseDialog() {
        dialogModal.current?.close();
    }

    function AddWorld(formData : FormData) {
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
                    notificationContext.notify("error","Failed to create world. Note that you can only have" + DBConfig.maxProjects + "personal worlds.")
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

    function iconCallback(e : number) {
        setIcon(e);
    }

    return (
        <>
            <Dialog shouldClose={false} ref={dialogModal} title="Add world">
                <form action={AddWorld} className="mt-8 flex flex-col gap-4">
                        <div className="grid w-full md:grid-cols-6 lg:grid-cols-7 grid-cols-4 p-2 overflow-y-scroll gap-1 h-32 md:h-40">
                            {WorldIconColors.map((e,i)=>(
                                <WorldIcon onClick={()=>iconCallback(i)} key={i} className="group size-full cursor-pointer" iconIndex={i}></WorldIcon>
                            ))}
                        </div>
                    <div className="flex w-full items-center gap-2">
                        <WorldIcon iconIndex={icon}></WorldIcon>
                        <Input 
                            name="name" 
                            type="text" 
                            placeholder="Name" 
                            required
                            minLength={3}
                            maxLength={48}
                        />
                    </div>
                    <Button type="submit" name="w" className="mt-4">Add</Button>
                </form>
            </Dialog>
            <div className="flex justify-between items-end">
                <h3 className="text-2xl">Your worlds</h3>
                <Button title="Add new Frequency" onClick={OpenDialog} variant={"default"} disabled={loading}>Add new <LucidePlus /></Button>
            </div>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-flow-row auto-rows-fr gap-2 mt-2">
                {loading ? <Skeleton /> : projectData ? projectData.length > 0 ? projectData.map(e=>(
                    <World key={e.project_uuid} project={e} loaded={e.loaded ?? true}/>
                )) : <p className="opacity-70 text-sm">No worlds. Make or join one to get started</p> : <div>Failed to load worlds</div>}
            </div>
        </>
    )
}

function Skeleton() {
    return [1,2,3,4,5].map(e=>(
        <div key={e} className="h-14 w-full bg-input animate-pulse rounded-lg"></div>
    ))
}
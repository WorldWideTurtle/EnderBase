'use client'

import { Button } from "@/components/ui/button";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../../worlds-context";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { projectMember } from "@/db/schemes";
import { LucideRepeat, LucideTrash } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function page() {
    const [memberData, setMemberData] = useState<projectMember[]>()
    const [searchInput, setSearchInput] = useState<string>()
    const worldContext = useContext(ProjectContext)
    const currentUser = useRef<projectMember>(null);
    const [currentLink, setCurrentLink] = useState<string>()
    const [fetching, setFetching] = useState<boolean>(false)

    function GetLink() {
        if (!worldContext?.worldID || currentLink) return;

        setFetching(true)
        createClient().rpc("manage_invite_link",{in_project_uuid:worldContext?.worldID}).then(e=>{
            setFetching(false)
            if (!e.error) {
                setCurrentLink(e.data)
            } else {
                console.log(e.error)
            }
        })
    }

    const searchRegex = useCallback(()=>{
        return new RegExp(searchInput ?? "","gi")
    }, [searchInput])

    function getName(user : projectMember) {
        return (user.user_name === null ? user.name : user.user_name)
    }

    const filteredList = useCallback(()=>{
        return memberData ? memberData.filter(e=>(e.user_id !== worldContext?.user.id) && getName(e)!.match(searchRegex())) : []
    }, [searchRegex(),memberData])

    useEffect(()=>{
        if (!worldContext?.worldID) return;
        createClient().rpc("get_project_members_by_uuid",{p_uuid:worldContext.worldID}).then(e=>{
            if (!e.error) {
                const users = e.data as projectMember[];
                setMemberData(users)
                console.log(users)
                currentUser.current = users.find(e=>e.user_id = worldContext.user.id) ?? null
            } else {
                console.log(e.error)
            }
        })
    },[worldContext?.worldID])

    function RemoveMember(id : string) {
        if (!worldContext?.worldID) return;
        const userIndex = memberData!.findIndex(e=>e.user_id===id)
        const user = memberData![userIndex]
        setMemberData((prev) => prev!.toSpliced(userIndex,1))

        createClient().rpc("remove_project_membership",{p_uuid:worldContext.worldID,u_uuid:id}).then(e=>{
            if (!e.error) {

            } else {
                setMemberData((prev) => [
                    ...prev!.slice(0,userIndex),
                    user,
                    ...prev!.slice(userIndex + 1)
                ])
                console.log(e.error)
            }
        })
    }
    

    return (
        <Root defaultValue="members">
            <List aria-label="Switch display" className="pb-6 flex">
                <Trigger value="members" className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                    Members
                </Trigger>
                <Trigger value="world" className="relative flex-1 p-2 text-lg after:transition-[background-color] aria-selected:after:bg-purple-400 after:bg-input after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 aria-selected:after:h-1">
                    World
                </Trigger>
            </List>
            <Content value="members">
                <div className="grid grid-flow-row auto-rows-auto m-auto max-w-[30rem] gap-8">
                    <div>
                        <h3 className="text-lg">Add Members</h3>
                        <p className="opacity-85 leading-4">To add users, generate an invite link an send it to them. A link lasts 15 minutes and anyone with it can join your world. You can remove them at any point.</p>
                        <div className="flex">
                            <Input readOnly value={currentLink ? `${window.location.origin}/invites/${currentLink}` : "..."}/>
                            <Button onClick={GetLink} title="Generate new link" disabled={fetching} type="submit" variant={"default"}><LucideRepeat></LucideRepeat></Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg">Manage Members</h3>
                        <Input type="text" placeholder="Search member" onChange={e=>setSearchInput(e.target.value)}></Input>
                        <ul className="flex flex-col gap-1 mt-4 divide-x-2 divide-input" aria-label="List of project members">
                            {memberData ? filteredList().map(e=>(
                                <li key={e.user_id} className="flex justify-between gap-2 hover:bg-input/30 p-1 group">
                                    <span className="text-ellipsis opacity-85" >{getName(e)}</span>
                                    <Button title="Delete member from world" className="p-0 h-fit" variant={"ghost"} onClick={() => RemoveMember(e.user_id)}><LucideTrash className="text-destructive opacity-0 group-hover:!opacity-100"></LucideTrash></Button>
                                </li>
                            )) : <MemberSkeleton />}
                        </ul>
                    </div>
                </div>
            </Content>
            <Content value="world">
                <div className="grid grid-flow-row auto-rows-auto m-auto max-w-[30rem] gap-8">
                    <ChangeWorldNameForm />
                    <hr />
                    <div className="flex flex-col gap-2">
                        <DeleteWorldButton currentUser={currentUser.current} />
                    </div>
                </div>
            </Content>
        </Root>
    )
}

function MemberSkeleton() {
    return (new Array(4)).fill(0).map((e,i)=>(
        <span key={i} className="w-full inline-block animate-pulse text-transparent bg-input">Loading</span>
    ))
}

function ChangeWorldNameForm() {
    const [worldInput, setWorldInput] = useState<string>()
    const worldContext = useContext(ProjectContext)

    function ChangeWorldName(formData : FormData) {
        let newName = formData.get("newName") as string;
        if (newName.length > 2 && newName.length < 48) {
            createClient().from("projects").update({project_name:newName}).eq("project_uuid",worldContext?.worldID).then(e=>{
                if (!e.error) {
                    worldContext?.setProjectName(newName)
                } else {
                    console.log(e.error)
                }
            })
        }
    }

    return (
        <form action={ChangeWorldName}>
            <label htmlFor="newName">Change name:</label>
            <div className="flex">
                <Input name="newName" type="Text" placeholder={worldContext?.projectName} defaultValue={worldInput} onChange={e=>setWorldInput(e.target.value)} minLength={3} maxLength={48} required/>
                <Button disabled={worldContext?.isSwitching || worldContext?.projectName === undefined} type="submit" variant={"default"}>Save</Button>
            </div>
        </form>
    )
}

function DeleteWorldButton({currentUser} : {currentUser : projectMember | null}) {
    const worldContext = useContext(ProjectContext)
    const dialog = useRef<HTMLDialogElement>(null);
    const router = useRouter()

    function DeleteWorld() {
        if (worldContext?.worldID) {
            createClient().from("projects").delete().eq("project_uuid",worldContext?.worldID).then(e=>{
                if (!e.error) {
                    router.push("/worlds")
                } else {
                    console.log(e.error)
                }
            })
        }
    }

    function submitDelete() {
        dialog.current?.showModal();
    }

    return (<>
            <ConfirmDialog ref={dialog} title="Confirm Delete" text="This can not be undone. It will remove all data connected to this world." confirmText={"DELETE " + worldContext?.projectName} callback={DeleteWorld} />
            {(currentUser && (currentUser.user_role > 0)) ? 
            <Button variant={"destructive"} onClick={submitDelete} disabled={worldContext?.isSwitching || worldContext?.projectName === undefined} className="w-full">Delete world</Button> :
            <div><Button variant={"destructive"} disabled={true} className="w-full bg-input animate-pulse">Loading</Button></div>}
        </>)
    
}
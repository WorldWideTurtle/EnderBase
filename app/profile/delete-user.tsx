'use client'

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useRef } from "react"



export function DeleteUser(props : {callback: ()=>any}) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    function OpenDialog() {
        dialogRef.current?.showModal();
    }
    return (
        <>
            <Button onClick={OpenDialog} type="submit" variant={"destructive"}>Delete User</Button>
            <ConfirmDialog ref={dialogRef} title="Delete user" text="Are you sure? This action can not be reversed. You projects will be deleted at once." confirmText="DELETE USER" callback={props.callback}/>
        </>
    )
}
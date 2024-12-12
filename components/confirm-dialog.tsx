'use client'

import { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from "react";
import { Dialog } from "./dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type DialogProps = {
    title: string
    text: string
    confirmText: string
    children?: ReactNode
    callback: ()=>any
}

export const ConfirmDialog = forwardRef<HTMLDialogElement,DialogProps>((props, ref) => {
    const [input,setInput] = useState<string>();
    const localRef = useRef<HTMLDialogElement>(null)

    useImperativeHandle(ref, () => localRef.current!, [])

    function CloseDialog() {
        localRef.current?.close();
    }

    function callback() {
        CloseDialog();
        props.callback();
    }

    return (
      <Dialog ref={localRef} title={props.title}>
        <p className="mt-2">{props.text}</p>
        <label htmlFor="">Type <span className="font-bold">{props.confirmText}</span> to continue</label>
        <form action={callback}>
            <Input name="confirm" type="text" onChange={(e)=>setInput(e.target.value ?? "")} defaultValue={input}/>
            <Button className="w-full mt-1" disabled={input !== props.confirmText} variant={"destructive"} type="submit">Confirm</Button>
        </form>
      </Dialog>
    );
})
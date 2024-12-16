'use client'

import { forwardRef, MouseEvent, ReactNode, useImperativeHandle, useRef } from "react";
import { Button } from "./ui/button";
import { LucidePlus } from "lucide-react";

type DialogProps = {
    title: string
    children?: ReactNode
    shouldClose?: boolean
}

export const Dialog = forwardRef<HTMLDialogElement,DialogProps>((props, ref) => {
    const localRef = useRef<HTMLDialogElement>(null)

    useImperativeHandle(ref, () => localRef.current!, [])

    function CloseDialog() {
        localRef.current?.close();
    }

    function CheckDialogBounds(e : MouseEvent) {
        console.log(e.target)
        if (localRef.current === null) return;
        const rect = localRef.current.getBoundingClientRect();
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
      <dialog ref={localRef} onClick={props.shouldClose === false ? undefined : CheckDialogBounds} className="backdrop:backdrop-blur-none backdrop:backdrop-brightness-50 p-2 rounded-lg">
        <div className="flex justify-between">
            <h2>{props.title}</h2>
            <Button onClick={CloseDialog} className="size-6 aspect-square overflow-hidden p-px" variant={"ghost"}><LucidePlus className="rotate-45 hover:text-red-500"/></Button>
        </div>
        <div>
            {props.children}
        </div>
      </dialog>
    );
})


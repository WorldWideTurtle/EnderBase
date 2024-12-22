'use client'

import { createRef, RefObject, useEffect } from "react";
import classes from "./bg.module.css"

export function HeroBG() {
    const layerCount = 10;
    const elementRefs : RefObject<null | HTMLDivElement>[] = (new Array(layerCount)).fill(0).map(e=>createRef())

    useEffect(()=>{
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx === null) return;

        canvas.width = 128
        canvas.height = 128;

        const img = new Image();
        img.crossOrigin = "Anonymous"; // Allows canvas operations on cross-origin images
        img.src = "/EP.webp";

        img.onload = () => {
            elementRefs.forEach(e=>{
                if (!e.current) return;
                ctx.clearRect(0,0,128,128)
                ctx.filter = `hue-rotate(${Math.round(180 + Math.random() * 60)}deg)`;
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL()
    
                const startX = Math.round(50 - Math.random() * 100);
                const startY = Math.round(50 - Math.random() * 100);
                const scale = Math.round(256 + Math.random() * 512*4);
                const elementStyle = e.current.style
                elementStyle.backgroundImage = `url("${dataURL}")`
                elementStyle.setProperty("--start-x", startX + "px")
                elementStyle.setProperty("--start-y", startY + "px")
                elementStyle.setProperty("--end-x", (startX + scale * ((Math.random() > 0.5) ? 1 : -1)) + "px")
                elementStyle.setProperty("--end-y", (startY + scale * ((Math.random() > 0.5) ? 1 : -1)) + "px")
                elementStyle.animationDuration = 1000 * (scale / 2560)**1.5 + "s"
                elementStyle.backgroundSize = `${scale}px ${scale}px`
            })
        }
    })

    return (
        <div className="absolute w-full h-full top-0 -z-20 isolate overflow-hidden opacity-30 contain-strict">
            {(new Array(layerCount)).fill(0).map((e,i)=>(
                <div key={i} ref={elementRefs[i]} className={"w-full h-full bg-transparent absolute left-0 top-0 " + classes.animate}></div>
            ))}
        </div>
    )
}
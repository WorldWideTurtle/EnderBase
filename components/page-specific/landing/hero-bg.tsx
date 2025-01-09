'use client'

import { createRef, useEffect, useRef } from "react";
import classes from "./bg.module.css"

export function HeroBG() {
    const src = "/EP.webp";
    const layerCount = 5;
    const elementRefs = (new Array(layerCount)).fill(0).map(e=>createRef<HTMLDivElement>())
    const fallbackRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx === null) {
            if (fallbackRef.current)
                fallbackRef.current.style.display = "block";
                elementRefs.forEach(e=>{
                    if (e.current) e.current.remove()
                })
            return;
        };
        
        canvas.width = 128
        canvas.height = 128;

        const img = new Image();
        img.crossOrigin = "Anonymous"; // Allows canvas operations on cross-origin images
        img.src = src;


        const FULL_CIRCLE = Math.PI * 2;
        img.onload = () => {
            elementRefs.forEach(e=>{
                if (fallbackRef.current) fallbackRef.current.remove();
                if (!e.current) return;
                ctx.clearRect(0,0,128,128)
                ctx.filter = `hue-rotate(${Math.round(180 + Math.random() * 60)}deg) brightness(160%)`;
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL()
                const scale = Math.round(512 + Math.random() * 512*2);
                const startX = Math.round(50 - Math.random() * 100);
                const startY = Math.round(50 - Math.random() * 100);
                const degreeOfRotation = Math.random() * FULL_CIRCLE;
                const endX = startX;
                const endY = startY - scale;
                const elementStyle = e.current.style
                elementStyle.backgroundImage = `url("${dataURL}")`
                elementStyle.setProperty("--start-x", startX + "px")
                elementStyle.setProperty("--start-y", startY + "px")
                elementStyle.setProperty("--end-x", endX + "px")
                elementStyle.setProperty("--end-y", endY + "px")
                elementStyle.animationDuration = 1000 * (scale / 2560)**1.5 + "s"
                elementStyle.backgroundSize = `${scale}px ${scale}px`
                elementStyle.rotate = ((degreeOfRotation / FULL_CIRCLE) * 360 + 180) + "deg"
            })
        }
    })

    return (
        <div className="absolute w-full h-full top-0 -z-20 isolate overflow-hidden opacity-30 contain-strict">
            <div ref={fallbackRef} className="hidden">
                <div className="w-full h-full bg-transparent absolute left-0 top-0" style={{
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "2048px 2048px",
                    backgroundPosition: "-1200px 400px",
                    imageRendering: "pixelated",
                    filter: "hue-rotate(200deg)"
                }}></div>
                <div className="w-full h-full bg-transparent absolute left-0 top-0" style={{
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "1024px 1024px",
                    backgroundPosition: "-300px 800px",
                    imageRendering: "pixelated",
                    filter: "hue-rotate(200deg)"
                }}></div>
                <div className="w-full h-full bg-transparent absolute left-0 top-0" style={{
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "1536px 1536px",
                    backgroundPosition: "500px 400px",
                    imageRendering: "pixelated",
                    filter: "hue-rotate(200deg)"
                }}></div>
            </div>
            {(new Array(layerCount)).fill(0).map((e,i)=>(
                <div key={i} ref={elementRefs[i]} className={"w-[142vmax] h-[142vmax] bg-transparent absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] origin-top-left " + classes.animate}></div>
            ))}
        </div>
    )
}
/// VMAX 142 because the diagonal of a square is ~1.42 * the side length. This ensures no rotation causes empty corners
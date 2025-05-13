'use client'

import { createRef, useEffect, useRef } from "react";
import classes from "./bg.module.css"

export function HeroBG() {
    const src = "/EP.webp";
    const scaleTable = [200, 400, 700, 1000, 1200]
    const elementRefs = (new Array(scaleTable.length)).fill(0).map(e=>createRef<HTMLDivElement>())
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
        img.crossOrigin = "Anonymous";
        img.src = src;


        let scaleTable = [200, 400, 700, 1000, 1200]
        const FULL_CIRCLE = Math.PI * 2;
        img.onload = () => {
            elementRefs.forEach((e,i)=>{
                if (fallbackRef.current) fallbackRef.current.remove();
                if (!e.current) return;
                ctx.clearRect(0,0,128,128)
                ctx.filter = `hue-rotate(${Math.round(180 + Math.random() * 60)}deg) brightness(160%)`;
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL()
                const scale = scaleTable[i];
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
                e.current.classList.add(classes.animate);
                elementStyle.animationDuration = 1000 * (scale / 2560)**1.5 + "s"
                elementStyle.backgroundSize = `${scale}px`
                elementStyle.rotate = ((degreeOfRotation / FULL_CIRCLE) * 360 + 180) + "deg"
            })
        }
    }, [])

    return (
        <div className="absolute w-full h-full top-0 -z-20 isolate overflow-hidden contain-strict">
            <div className="w-full h-full absolute left-0 top-0 bg-background"></div>
            <div ref={fallbackRef} className="hidden">
                <div className="w-full h-full bg-transparent absolute left-0 top-0 opacity-40" style={{
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "2048px 2048px",
                    backgroundPosition: "-1200px 400px",
                    imageRendering: "pixelated",
                    filter: "hue-rotate(200deg)"
                }}></div>
                <div className="w-full h-full bg-transparent absolute left-0 top-0 opacity-40" style={{
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "1024px 1024px",
                    backgroundPosition: "-300px 800px",
                    imageRendering: "pixelated",
                    filter: "hue-rotate(200deg)"
                }}></div>
                <div className="w-full h-full bg-transparent absolute left-0 top-0 opacity-40" style={{
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "1536px 1536px",
                    backgroundPosition: "500px 400px",
                    imageRendering: "pixelated",
                    filter: "hue-rotate(200deg)"
                }}></div>
            </div>
            {(new Array(scaleTable.length)).fill(0).map((e,i)=>(
                <div key={i} ref={elementRefs[i]} className="w-[142vmax] h-[142vmax] opacity-40 bg-transparent absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] origin-top-left">.</div>
            ))}
        </div>
    )
}
/// VMAX 142 because the diagonal of a square is ~1.42 * the side length. This ensures no rotation causes empty corners
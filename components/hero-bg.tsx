'use client'

import { useEffect, useState } from "react"

function GetBase() {
    return (new Array(300)).fill(0).map(e=>{
        return [
            RoundTo(Math.random()*10 + 5,1),
            RoundTo(Math.random()*20 + 5,1),
            RoundTo(Math.random()*100,1),
            RoundTo(Math.random()*100,1),
            RoundTo(0.8 - Math.random() * 1,1)
        ]
    })
}

function RoundTo(x: number, digits: number) {
    return Math.round(x * Math.pow(10,digits)) / (Math.pow(10,digits))
}

function Clamp(x: number, min: number, max:number) {
    return Math.min(max,Math.max(x,min));
}

export function HeroBG() {
    const [points,setPoints] = useState<number[][]>(GetBase())

    useEffect(()=>{
        let nextFrame : number = 0

        const getNewPoints = () => {
            const newPoints = [...points].map(e=>{
                return [
                    e[0],
                    e[1],
                    Clamp(RoundTo(e[2] + Math.random()*5,1),0,window.innerWidth),
                    Clamp(RoundTo(e[3] + Math.random()*5,1),0,window.innerHeight),
                    e[4]
                ]
            })
            setPoints(newPoints);
        }
        
        let interval : NodeJS.Timeout | null = null;
        const timeOut = setTimeout(()=>{
            nextFrame = requestAnimationFrame(getNewPoints)  
            interval = setInterval(()=>{
                nextFrame = requestAnimationFrame(getNewPoints)  
            },3000)
        }, 250)

        return () => {
            if (interval) clearInterval(interval)
            clearTimeout(timeOut)
            cancelAnimationFrame(nextFrame)
        }
    },[])

    return (
        <div className="absolute w-full h-full top-0 -z-20 isolate overflow-hidden">
            {points.map((e,i)=>(
                <div key={i} suppressHydrationWarning style={{
                    width: e[0],
                    height: e[1],
                    transform: `translateX(${e[2] * window.innerWidth / 100}px) translateY(${e[3] * window.innerHeight / 100}px)`,
                    position: "absolute",
                    left: 0,
                    top: 0,
                    background: "#1e403f",
                    filter: "blur(3px)",
                    transition: "transform 4s ease",
                    opacity: e[4]
                }}></div>
            ))}
        </div>
    )
}
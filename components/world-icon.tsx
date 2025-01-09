import { CSSProperties, memo } from "react";

type Props = {
    className?: string
    iconIndex: number
    style?: CSSProperties
    onClick?: (index: number)=>void
}

function componentToHex(c : number) {
    var hex = Math.max(Math.min(c,255),0).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r : number, g : number, b : number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex : string) {
    var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    result?.splice(0,1)
    return result!.map(e=>parseInt(e,16));
}

type ColorData = [string,string,number?]

export const WorldIconColors : ColorData[] = [
    ["6f4f36","Dirt"],
    ["848484","Stone"],
    ["d0bd90","Sand"],
    ["4f4f4f","Bedrock"],
    ["251c3b","Obsidian"],
    ["6f3131","Netherrack"],
    ["131313","Block of Coal", 2],
    ["c16e50","Block of Copper"],
    ["7af2e1","Block of Diamond"],
    ["4cd877","Block of Emerald"],
    ["494548","Block of Netherite"],
    ["f9e44f","Block of Gold"],
    ["dddddd","Block of Iron"],
    ["1e4385","Block of Lapis"],
    ["960e00","Block of Redstone"],
    ["9ca3ad","Clay"],
    ["b02e26","Red Concrete", 0],
    ["f9801d","Orange Concrete", 0],
    ["fed83d","Yellow Concrete", 0],
    ["80c71f","Lime Concrete", 0],
    ["5e7c16","Green Concrete", 0],
    ["169c9c","Cyan Concrete", 0],
    ["3ab3da","Light Blue Concrete", 0],
    ["3c44aa","Blue Concrete", 0],
    ["8932b8","Purple Concrete", 0],
    ["c74ebd","Magenta Concrete", 0],
    ["f38baa","Pink Concrete", 0],
    ["835432","Brown Concrete", 0],
    ["1c1c20","Black Concrete", 0],
    ["474f52","Grey Concrete", 0],
    ["9d9d97","Light Grey Concrete", 0],
    ["f4f4f4","White Concrete", 0],
    ["b02e26","Red Wool", -15],
    ["f9801d","Orange Wool", -15],
    ["fed83d","Yellow Wool", -15],
    ["80c71f","Lime Wool", -15],
    ["5e7c16","Green Wool", -15],
    ["169c9c","Cyan Wool", -15],
    ["3ab3da","Light Blue Wool", -15],
    ["3c44aa","Blue Wool", -15],
    ["8932b8","Purple Wool", -15],
    ["c74ebd","Magenta Wool", -15],
    ["f38baa","Pink Wool", -15],
    ["835432","Brown Wool", -15],
    ["1c1c20","Black Wool", -15],
    ["474f52","Grey Wool", -15],
    ["9d9d97","Light Grey Wool", -15],
    ["f4f4f4","White Wool", -15],
]

export function WorldIcon(props : Props) {
    let iconColor = WorldIconColors[props.iconIndex ?? 0];

    const color = hexToRgb(iconColor[0]);
    const brightColors = (new Array(3)).fill(0).map((e,i)=>{
        //@ts-ignore
        return rgbToHex.apply({},color.map(c=>~~(c * Math.pow(0.85,i))))
    })
    const darkColors = (new Array(3)).fill(0).map((e,i)=>{
        //@ts-ignore
        return rgbToHex.apply({},color.map(c=>~~((c-(iconColor[2] ?? 20)) * Math.pow(0.85,i))))
    })
    const setIcon = [
        ...brightColors,
        ...darkColors
    ]

    function clickHandler () {
        props.onClick?.(props.iconIndex);
    }

    return (
        <div title={iconColor[1]}>
            <svg onClick={clickHandler} xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 696 800" width={48} height={48} className={props.className} style={props.style}>
                <path fill={setIcon[0]} className="stroke-black dark:stroke-white group-hover:stroke-[40px]" d="M400 12.1 64.1 206.1V593.9L400 787.9l335.9-194V206.1L400 12.1" transform="translate(-62.1 -9.8)" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon fill={setIcon[0]} points="2 196.2 337.9 2.3 673.8 196.3 337.9 390.2"/>
                <polygon fill={setIcon[4]} points="2 584.1 2 196.2 337.9 389.2 337.9 778"/>
                <polygon fill={setIcon[2]} points="337.9 778 337.9 389.2 673.8 196.3 673.8 584.1"/>
                <polygon fill={setIcon[1]} points="2 390.2 2 196.2 170 293.2 170 487.1"/>
                <polygon fill={setIcon[1]} points="170 681.1 170 487.1 337.9 584.1 337.9 778"/>
                <polygon fill={setIcon[5]} points="337.9 778 337.9 584.1 505.9 487.1 505.9 681.1"/>
                <polygon fill={setIcon[5]} points="505.9 487.1 505.9 293.2 673.8 196.2 673.8 390.2"/>
                <polygon fill={setIcon[3]} points="337.9 196.3 505.8 99.3 673.8 196.2 505.9 293.2"/>
                <polygon fill={setIcon[3]} points="2 196.2 170 99.2 337.9 196.2 170 293.2"/>
            </svg>
        </div>
    )
}

export const MemoizedWorldIcon = memo(WorldIcon);
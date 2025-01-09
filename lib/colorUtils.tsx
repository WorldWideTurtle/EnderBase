export const minecraftColors = [
    ["#b02e26","Red"],
    ["#f9801d","Orange"],
    ["#fed83d","Yellow"],
    ["#80c71f","Lime"],
    ["#5e7c16","Green"],
    ["#169c9c","Cyan"],
    ["#3ab3da","Light Blue"],
    ["#3c44aa","Blue"],
    ["#8932b8","Purple"],
    ["#c74ebd","Magenta"],
    ["#f38baa","Pink"],
    ["#835432","Brown"],
    ["#1c1c20","Black"],
    ["#474f52","Gray"],
    ["#9d9d97","Light Gray"],
   [ "#ffffff","White"],
]

export function SplitNumber(number : number) {
    const colorA = number & 15
    const colorB = (number >> 4) & 15
    const colorC = (number >> 8) & 15

    return [colorC,colorB,colorA]
}

export function GetColors(indexes: number[]) {
    return indexes.map(e=>minecraftColors[e][0])
}

export function CreateColorSwatches(number : number) {
    return GetColors(SplitNumber(number)).map((color,i)=>(
        <span key={i} style={{background:color}} className="size-4 rounded-sm"></span>
    ))
}

export function ColorsToNumber(numbers: number[]) {
    return (numbers[0] << 8) | (numbers[1] << 4) | numbers[2];
}
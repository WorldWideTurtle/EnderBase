export const minecraftColors = [
    "#b02e26",
    "#f9801d",
    "#fed83d",
    "#80c71f",
    "#5e7c16",
    "#169c9c",
    "#3ab3da",
    "#3c44aa",
    "#8932b8",
    "#c74ebd",
    "#f38baa",
    "#835432",
    "#1c1c20",
    "#474f52",
    "#9d9d97",
    "#ffffff",
]

export function SplitNumber(number : number) {
    const colorA = number & 15
    const colorB = (number >> 4) & 15
    const colorC = (number >> 8) & 15

    return [colorC,colorB,colorA]
}

export function GetColors(indexes: number[]) {
    return indexes.map(e=>minecraftColors[e])
}

export function CreateColorSwatches(number : number) {
    return GetColors(SplitNumber(number)).map((color,i)=>(
        <span key={i} style={{background:color}} className="size-4 rounded-sm"></span>
    ))
}

export function ColorsToNumber(numbers: number[]) {
    return (numbers[0] << 8) | (numbers[1] << 4) | numbers[2];
}
import { Data } from "./data"
import { WorldName } from "./world-name"

export default async function Page({params} : {
    params : Promise<{uuid:string}>
}) {
    const uuid = (await params).uuid

    return (
        <div>
            <WorldName></WorldName>
            <Data id={uuid} />
        </div>
    )
}
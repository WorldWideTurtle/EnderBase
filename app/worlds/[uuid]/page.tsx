import { Data } from "./data"

export default async function Page({params} : {
    params : Promise<{uuid:string}>
}) {
    const uuid = (await params).uuid

    return (
        <div>
            <Data id={uuid} />
        </div>
    )
}
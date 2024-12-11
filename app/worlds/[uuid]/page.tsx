import { Data } from "./data"

export default async function Page({params} : {
    params : Promise<{uuid:string}>
}) {
    const uuid = (await params).uuid

    return (
        <Data id={uuid} />
    )
}
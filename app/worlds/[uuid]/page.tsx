import { Data } from "./data"
import { WorldDataProvider } from "@/components/context/world-data-context"

export default async function Page({params} : {
    params : Promise<{uuid:string}>
}) {
    const uuid = (await params).uuid

    return (
        <WorldDataProvider id={uuid}>
            <Data />
        </WorldDataProvider>
    )
}
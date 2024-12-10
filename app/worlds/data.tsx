'use client'

import { useEffect, useState } from "react";
import { World } from "@/components/world";
import { project } from "@/db/schemes";

export function Data() {
    const [projectData, setProjectData] : [project[], Function] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Fetch project data on load
        fetch(`/api/worlds/`)
        .then((res) => res.json())
        .then((data) => {
            setProjectData(data);
            setLoading(false);
        })
        .catch((err) => console.error(err));
    }, []);

    return (
        <>
            {loading ? <Skeleton /> : projectData ? projectData.map(e=>(
                <World key={e.project_name} project={e}/>
            )) : <div>Failed to load worlds</div>}
        </>
    )
}

function Skeleton() {
    return [1,2,3].map(e=>(
        <div key={e} className="h-14 w-full bg-input animate-pulse rounded-lg"></div>
    ))
}
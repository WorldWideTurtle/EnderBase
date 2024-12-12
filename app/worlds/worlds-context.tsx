'use client'

import { createClient } from '@/utils/supabase/client';
import { usePathname } from 'next/navigation';
import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';

export const ProjectContext = createContext<{projectName: string | undefined, worldID : string, setProjectName: Function, isSwitching: boolean} | null>(null);

export const ProjectProvider = ({ children } : {children : ReactNode}) => {
  const [projectName, setProjectName] = useState<string>();
  const [isSwitching, setSwitching] = useState<boolean>(false);
  const [lastID,setLastID] = useState<string>();
  const worldID = usePathname().split("/")[2];

  useEffect(()=>{
    if (worldID && worldID !== lastID) {
      setLastID(worldID)
    }
  },[worldID])

  useEffect(() => {
    const fetchProjectName = async () => {
      if (worldID) {
        setSwitching(true);
        console.log("Fetching")
        createClient().from("projects").select("project_name").eq("project_uuid",worldID).single().then(e=>{
            if (e.error === null) {
                setProjectName(e.data.project_name);
                setSwitching(false);
            } else {
                throw new Error(e.error.message)
            }
        });
      }
    };
    fetchProjectName();
  }, [lastID]);

  return (
    <ProjectContext.Provider value={{ projectName, worldID, setProjectName, isSwitching }}>
      {children}
    </ProjectContext.Provider>
  );
};
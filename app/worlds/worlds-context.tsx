'use client'

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { createContext, useState, useEffect, ReactNode } from 'react';

export const ProjectContext = createContext<{projectName: string | undefined, worldID : string, setProjectName: Function, isSwitching: boolean, user : User, projectIcon : number} | null>(null);

export const ProjectProvider = ({ children, user } : {children : ReactNode, user : User}) => {
  const [projectName, setProjectName] = useState<string>();
  const [projectIcon, setProjectIcon] = useState<number>(0);
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
        createClient().from("projects").select("project_name,icon_id").eq("project_uuid",worldID).single().then(e=>{
            if (e.error === null) {
                setProjectName(e.data.project_name);
                setProjectIcon(e.data.icon_id);
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
    <ProjectContext.Provider value={{ projectName, worldID, setProjectName, isSwitching, user, projectIcon }}>
      {children}
    </ProjectContext.Provider>
  );
};
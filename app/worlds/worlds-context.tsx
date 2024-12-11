'use client'

import { createClient } from '@/utils/supabase/client';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export const ProjectContext = createContext<{projectName: string | undefined, setWorldID : Function, setProjectName: Function, isSwitching: boolean} | null>(null);

export const ProjectProvider = ({ children } : {children : ReactNode}) => {
  const [projectName, setProjectName] = useState<string>();
  const [worldID, setWorldID] = useState<string>();
  const [isSwitching, setSwitching] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjectName = async () => {
      if (worldID) {
        setSwitching(true);
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
  }, [worldID]);

  return (
    <ProjectContext.Provider value={{ projectName, setWorldID, setProjectName, isSwitching }}>
      {children}
    </ProjectContext.Provider>
  );
};
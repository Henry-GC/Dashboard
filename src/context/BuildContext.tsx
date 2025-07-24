"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Build } from "@/app/dashboard/ensambles/types";
import axios from "@/lib/axios-config";

interface BuildContextType {
  builds: Build[];
  setBuilds: (builds: Build[]) => void;
  refreshBuilds: () => Promise<void>;
}

const BuildContext = createContext<BuildContextType | undefined>(undefined);

export function useBuildContext() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("useBuildContext must be used within a BuildProvider");
  return ctx;
}

export function BuildProvider({ children }: { children: ReactNode }) {
  const [builds, setBuilds] = useState<Build[]>([]);

  // Fetch builds from API using Axios
  const refreshBuilds = async () => {
    try {
      const res = await axios.get("/adm/builds");
      setBuilds(res.data || []);
      
    } catch (error) {
      // Handle error if needed
      console.error("Error fetching builds:", error);
      setBuilds([]);
    }
  };

  useEffect(() => {
    refreshBuilds();
  }, []);

  return (
    <BuildContext.Provider value={{ builds, setBuilds, refreshBuilds }}>
      {children}
    </BuildContext.Provider>
  );
}

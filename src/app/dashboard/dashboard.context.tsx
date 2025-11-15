"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { TagData } from "./dal/bookmarks.dal";

type DState = {
  active?: number;
  archived?: number;
  tags: TagData[];
  loading: boolean;
  refresh?: () => void;
};

const DashboardContext = createContext<DState>({
  loading: false,
  refresh: () => {},
  tags: [],
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const abortRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<DState>({ loading: true, tags: [] });
  const [trigger, setTrigger] = useState(0); // to force refresh

  const qs = useMemo(() => searchParams.toString(), [searchParams]);
  // function to refresh the data on demand
  const refresh = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, loading: true }));
    const base = "/api/dashboard/data";
    const url = qs ? `${base}?${qs}&_=${Date.now()}` : `${base}?_=${Date.now()}`;

    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json() as Promise<DState>;
      })
      .then(({ active, archived, tags }) => setState({ active, archived, tags, loading: false }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ active: 0, archived: 0, tags: [], loading: false });
      });

    return () => controller.abort();
  }, [qs, trigger]);

  const values = useMemo(() => ({ ...state, refresh }), [state, refresh]);

  return <DashboardContext.Provider value={values}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  return useContext(DashboardContext);
}

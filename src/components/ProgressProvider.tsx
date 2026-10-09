"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  LocalStorageRepository,
  STORAGE_KEY,
  emptyState,
  parseState,
  type ProgressRepository,
} from "@/lib/storage";
import { applyAttempt } from "@/lib/progress";
import type { ProgressState, QuizAttempt } from "@/lib/types";

interface ProgressContextValue {
  state: ProgressState;
  /** false حتى تُقرأ البيانات من التخزين المحلي (بعد التحميل في المتصفح) */
  ready: boolean;
  recordAttempt: (attempt: QuizAttempt) => void;
  reset: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({
  children,
  repository,
}: {
  children: React.ReactNode;
  repository?: ProgressRepository;
}) {
  const repo = useMemo(() => repository ?? new LocalStorageRepository(), [repository]);
  const [state, setState] = useState<ProgressState>(() => emptyState(new Date(0)));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(repo.load());
    setReady(true);
    // مزامنة بين تبويبات المتصفح المفتوحة على الجهاز نفسه
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(repo.load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [repo]);

  const update = useCallback(
    (fn: (s: ProgressState) => ProgressState) => {
      setState((prev) => {
        const next = fn(prev);
        repo.save(next);
        return next;
      });
    },
    [repo],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      recordAttempt: (attempt) => update((s) => applyAttempt(s, attempt)),
      reset: () => {
        repo.clear();
        setState(emptyState());
      },
      exportData: () => JSON.stringify(state, null, 2),
      importData: (json) => {
        try {
          const raw = JSON.parse(json);
          if (!raw || raw.version !== 1) return false;
          const parsed = parseState(raw);
          update(() => parsed);
          return true;
        } catch {
          return false;
        }
      },
    }),
    [state, ready, update, repo],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

"use client";
import { useEffect, useState, useRef } from "react";
import {
  emptyProgress,
  readProgress,
  STORAGE_KEY,
  type Progress,
} from "@/lib/storage/progress";
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const current = useRef<Progress>(emptyProgress);
  useEffect(() => {
    current.current = readProgress();
    setProgress(current.current);
    setReady(true);
    const sync = () => {
      current.current = readProgress();
      setProgress(current.current);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(fn: (p: Progress) => Progress) {
    const result = fn(current.current);
    const next = {
      ...result,
      updatedAt: result === emptyProgress ? null : new Date().toISOString(),
    };
    current.current = next;
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "บันทึกไม่ได้: พื้นที่จัดเก็บเต็มหรือเบราว์เซอร์ปิดการใช้งาน ข้อมูลยังใช้ได้ในหน้านี้",
      );
    }
  }

  return { progress, ready, error, update };
}

export type ProgressStore = ReturnType<typeof useProgress>;

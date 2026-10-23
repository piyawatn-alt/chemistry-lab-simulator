"use client";
import { useEffect, useState, useRef } from "react";
import { parseReadingList, READING_LIST_KEY } from "@/lib/storage/reading-list";

export function useReadingList() {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const current = useRef<string[]>([]);
  useEffect(() => {
    function read() {
      try {
        current.current = parseReadingList(
          localStorage.getItem(READING_LIST_KEY),
        );
      } catch {
        current.current = [];
      }
      setSaved(current.current);
    }
    read();
    setReady(true);
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  function toggle(id: string) {
    const next = current.current.includes(id)
      ? current.current.filter((s) => s !== id)
      : [...current.current, id];
    current.current = next;
    setSaved(next);
    try {
      localStorage.setItem(READING_LIST_KEY, JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "บันทึกไว้ในเครื่องไม่ได้ เบราว์เซอร์อาจปิดพื้นที่จัดเก็บ รายการนี้จะอยู่เฉพาะหน้าที่เปิดไว้",
      );
    }
  }
  return { saved, ready, error, toggle };
}
export type ReadingList = ReturnType<typeof useReadingList>;

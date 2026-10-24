"use client";
import { useEffect, useState } from "react";
import {
  emptyJournal,
  parseJournal,
  JOURNAL_KEY,
  type LearningJournal,
} from "@/lib/storage/learning-journal";
export function useLearningJournal() {
  const [journal, setJournal] = useState(emptyJournal);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      setJournal(parseJournal(localStorage.getItem(JOURNAL_KEY)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  function update(next: LearningJournal) {
    setJournal(next);
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  return { journal, update, ready, storageError };
}

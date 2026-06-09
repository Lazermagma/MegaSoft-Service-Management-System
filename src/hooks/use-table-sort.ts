import { useCallback, useMemo, useState } from "react";

export type SortDir = "asc" | "desc";

type SortValue = string | number | null | undefined;

export function useTableSort<T>(
  items: T[],
  getValue: (item: T, key: string) => SortValue,
  initial?: { key: string; dir: SortDir }
) {
  const [sortKey, setSortKey] = useState<string | null>(initial?.key ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(initial?.dir ?? "asc");

  const toggleSort = useCallback((key: string) => {
    setSortKey((currentKey) => {
      if (currentKey === key) {
        setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
        return currentKey;
      }
      setSortDir("asc");
      return key;
    });
  }, []);

  const sorted = useMemo(() => {
    if (!sortKey) return items;
    const next = [...items];
    next.sort((a, b) => {
      const av = getValue(a, sortKey);
      const bv = getValue(b, sortKey);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return next;
  }, [items, sortKey, sortDir, getValue]);

  return { sorted, sortKey, sortDir, toggleSort };
}

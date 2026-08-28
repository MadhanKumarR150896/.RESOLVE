import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number, length: number) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    if (value.length < length) return;
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay, length]);

  return debouncedValue;
};

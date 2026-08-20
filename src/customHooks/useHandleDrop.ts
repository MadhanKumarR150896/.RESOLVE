import { useEffect, useState } from "react";

type TargetRef = React.RefObject<HTMLDivElement | null>;

export const useHandleDrop = (targetRef: TargetRef) => {
  const [showDrop, setShowDrop] = useState(true);

  useEffect(() => {
    const handleDrop = (e: Event) => {
      if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    };
    if (showDrop) {
      window.addEventListener("scroll", handleDrop, { capture: true });
      document.addEventListener("mousedown", handleDrop);
    }

    return () => {
      window.removeEventListener("scroll", handleDrop, { capture: true });
      document.removeEventListener("mousedown", handleDrop);
    };
  }, [showDrop, targetRef]);

  return { showDrop, setShowDrop };
};

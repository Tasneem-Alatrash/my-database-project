import { createContext, useContext, useEffect, useState } from "react";

const FactoryContext = createContext(null);

const STORAGE_KEY = "resort-ai-active-factory";

export function FactoryProvider({ children }) {
  const [activeFactory, setActiveFactory] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (activeFactory) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeFactory));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeFactory]);

  return (
    <FactoryContext.Provider value={{ activeFactory, setActiveFactory }}>
      {children}
    </FactoryContext.Provider>
  );
}

export function useFactory() {
  const ctx = useContext(FactoryContext);
  if (!ctx) throw new Error("useFactory must be used within a FactoryProvider");
  return ctx;
}

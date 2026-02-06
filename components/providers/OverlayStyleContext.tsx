"use client";

import { createContext, useContext, ReactNode } from "react";

export interface OverlayStyle {
  scale: number;
  fontFamily: string;
  fontSize: string;
}

const OverlayStyleContext = createContext<OverlayStyle | null>(null);

interface OverlayStyleProviderProps {
  children: ReactNode;
  style: OverlayStyle;
}

export function OverlayStyleProvider({
  children,
  style,
}: OverlayStyleProviderProps) {
  return (
    <OverlayStyleContext.Provider value={style}>
      {children}
    </OverlayStyleContext.Provider>
  );
}

export function useOverlayStyle(): OverlayStyle | null {
  return useContext(OverlayStyleContext);
}

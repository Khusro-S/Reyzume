import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ZoomState {
  zoomLevels: Record<string, number>; // reyzumeId -> zoom level
  getZoom: (reyzumeId: string) => number;
  zoomIn: (reyzumeId: string) => void;
  zoomOut: (reyzumeId: string) => void;
  setZoom: (reyzumeId: string, zoom: number) => void;
  resetZoom: (reyzumeId: string) => void;
}

export const MIN_ZOOM = 50;
export const MAX_ZOOM = 180;
export const ZOOM_STEP = 10;
export const DEFAULT_ZOOM = 100;

export const useZoomStore = create<ZoomState>()(
  persist(
    (set, get) => ({
      zoomLevels: {},
      getZoom: (reyzumeId: string) => {
        return get().zoomLevels[reyzumeId] ?? DEFAULT_ZOOM;
      },
      zoomIn: (reyzumeId: string) =>
        set((state) => {
          const currentZoom = state.zoomLevels[reyzumeId] ?? DEFAULT_ZOOM;
          return {
            zoomLevels: {
              ...state.zoomLevels,
              [reyzumeId]: Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM),
            },
          };
        }),
      zoomOut: (reyzumeId: string) =>
        set((state) => {
          const currentZoom = state.zoomLevels[reyzumeId] ?? DEFAULT_ZOOM;
          return {
            zoomLevels: {
              ...state.zoomLevels,
              [reyzumeId]: Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM),
            },
          };
        }),
      setZoom: (reyzumeId: string, zoom: number) =>
        set((state) => ({
          zoomLevels: {
            ...state.zoomLevels,
            [reyzumeId]: Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM),
          },
        })),
      resetZoom: (reyzumeId: string) =>
        set((state) => ({
          zoomLevels: {
            ...state.zoomLevels,
            [reyzumeId]: DEFAULT_ZOOM,
          },
        })),
    }),
    {
      name: "reyzume-zoom",
    }
  )
);

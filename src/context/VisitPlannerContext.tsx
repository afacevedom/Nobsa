import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PLACES } from '../data/places';
import { FESTIVALS } from '../data/festivals';

interface PlannerState {
  placeIds: string[];
  festivalIds: string[];
  notes: string;
}

interface VisitPlannerContextValue {
  placeIds: string[];
  festivalIds: string[];
  notes: string;
  totalSaved: number;
  isPlaceSaved: (id: string) => boolean;
  isFestivalSaved: (id: string) => boolean;
  togglePlace: (id: string) => void;
  toggleFestival: (id: string) => void;
  movePlace: (id: string, direction: 'up' | 'down') => void;
  loadTemplate: (placeIds: string[], festivalIds?: string[]) => void;
  setNotes: (notes: string) => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'nobsa-mi-visita-v3';
const VALID_PLACE_IDS = new Set(PLACES.map((p) => p.id));
const VALID_FESTIVAL_IDS = new Set(FESTIVALS.map((f) => f.id));

const DEFAULT_STATE: PlannerState = {
  placeIds: ['pueblo', 'ruanas', 'capilla'],
  festivalIds: ['dia-mundial-ruana'],
  notes: '',
};

const VisitPlannerContext = createContext<VisitPlannerContextValue | null>(null);

export function VisitPlannerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlannerState>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw) as Partial<PlannerState>;
      return {
        placeIds: Array.isArray(parsed.placeIds)
          ? parsed.placeIds.filter((id) => VALID_PLACE_IDS.has(id))
          : DEFAULT_STATE.placeIds,
        festivalIds: Array.isArray(parsed.festivalIds)
          ? parsed.festivalIds.filter((id) => VALID_FESTIVAL_IDS.has(id))
          : DEFAULT_STATE.festivalIds,
        notes: typeof parsed.notes === 'string' ? parsed.notes : '',
      };
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignorar si almacenamiento está lleno o bloqueado
    }
  }, [state]);

  const value = useMemo<VisitPlannerContextValue>(() => {
    const togglePlace = (id: string) => {
      if (!VALID_PLACE_IDS.has(id)) return;
      setState((prev) => ({
        ...prev,
        placeIds: prev.placeIds.includes(id)
          ? prev.placeIds.filter((item) => item !== id)
          : [...prev.placeIds, id],
      }));
    };

    const toggleFestival = (id: string) => {
      if (!VALID_FESTIVAL_IDS.has(id)) return;
      setState((prev) => ({
        ...prev,
        festivalIds: prev.festivalIds.includes(id)
          ? prev.festivalIds.filter((item) => item !== id)
          : [...prev.festivalIds, id],
      }));
    };

    const movePlace = (id: string, direction: 'up' | 'down') => {
      setState((prev) => {
        const idx = prev.placeIds.indexOf(id);
        if (idx === -1) return prev;
        const swapWith = direction === 'up' ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= prev.placeIds.length) return prev;
        const next = [...prev.placeIds];
        [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
        return { ...prev, placeIds: next };
      });
    };

    const loadTemplate = (placeIds: string[], festivalIds?: string[]) => {
      setState((prev) => ({
        ...prev,
        placeIds: placeIds.filter((id) => VALID_PLACE_IDS.has(id)),
        festivalIds: festivalIds
          ? festivalIds.filter((id) => VALID_FESTIVAL_IDS.has(id))
          : prev.festivalIds,
      }));
    };

    return {
      placeIds: state.placeIds,
      festivalIds: state.festivalIds,
      notes: state.notes,
      totalSaved: state.placeIds.length + state.festivalIds.length,
      isPlaceSaved: (id) => state.placeIds.includes(id),
      isFestivalSaved: (id) => state.festivalIds.includes(id),
      togglePlace,
      toggleFestival,
      movePlace,
      loadTemplate,
      setNotes: (notes) => setState((prev) => ({ ...prev, notes })),
      clearAll: () => setState({ placeIds: [], festivalIds: [], notes: '' }),
    };
  }, [state]);

  return (
    <VisitPlannerContext.Provider value={value}>{children}</VisitPlannerContext.Provider>
  );
}

export function useVisitPlanner(): VisitPlannerContextValue {
  const ctx = useContext(VisitPlannerContext);
  if (!ctx) throw new Error('useVisitPlanner debe usarse dentro de VisitPlannerProvider');
  return ctx;
}

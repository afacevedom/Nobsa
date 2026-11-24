import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface LightboxImageItem {
  filename: string;
  alt: string;
  caption?: string;
  credit?: string;
}

interface LightboxContextValue {
  isOpen: boolean;
  items: LightboxImageItem[];
  index: number;
  openLightbox: (item: LightboxImageItem, gallery?: LightboxImageItem[]) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export const NOBSA_GALLERY: LightboxImageItem[] = [
  {
    filename: 'Parque.jpg',
    alt: 'Parque Principal de Nobsa con palmeras y arquitectura tradicional',
    caption: 'Parque Principal de Nobsa — cuatro círculos sombreados por palmeras en el corazón urbano.',
    credit: 'Archivo fotográfico Nobsa · Felipe Acevedo (500px)',
  },
  {
    filename: 'NataliaParisRuana.jpg',
    alt: 'Ruana tejida en lana tradicional de Nobsa, Boyacá',
    caption: 'La ruana en lana virgen: emblema de más de 25 familias artesanas del municipio.',
    credit: 'Archivo cultural del proyecto Nobsa',
  },
  {
    filename: 'IglesiaNavidad.jpg',
    alt: 'Iglesia municipal de Nobsa con torre en piedra tallada',
    caption: 'Iglesia municipal construida en 1898: tres naves, torre de piedra tallada y altar de Anselmo Zárate.',
    credit: 'Archivo fotográfico Nobsa · Felipe Acevedo (500px)',
  },
  {
    filename: 'vinos.jpg',
    alt: 'Viñedo Marqués de Puntalarga en el Valle del Sol, Nobsa',
    caption: 'Viñedo Marqués de Puntalarga — catas y Festival de la Vid y el Vino en enero.',
    credit: 'Archivo cultural del proyecto Nobsa',
  },
  {
    filename: 'desde-la-capilla-de-lourdes.jpg',
    alt: 'Vista panorámica de Nobsa desde la Capilla de Lourdes',
    caption: 'Panorámica del casco urbano de Nobsa desde el monte El Calvario.',
    credit: 'Archivo fotográfico Nobsa · Felipe Acevedo (500px)',
  },
  {
    filename: 'capilla-de-lourdes-nobsa-boyacá.jpg',
    alt: 'Capilla de Nuestra Señora de Lourdes en Nobsa',
    caption: 'Capilla de Nuestra Señora de Lourdes, bien cultural y religioso en la subida hacia El Tungón.',
    credit: 'Archivo fotográfico Nobsa · Felipe Acevedo (500px)',
  },
  {
    filename: 'Cruz_de_Aranda.jpg',
    alt: 'Monumento de la Cruz de Aranda en el cerro El Tungón',
    caption: 'Cruz de Aranda — destino de peregrinación y MTB cada 1.º de mayo en el cerro El Tungón.',
    credit: 'Archivo cultural del proyecto Nobsa',
  },
  {
    filename: 'nobsa-vía-principal-boyacá.jpg',
    alt: 'Calle de ruanas y artesanías en Nobsa, Boyacá',
    caption: 'Vía principal de Nobsa y tiendas de ruanas, tejidos, forja y dulces típicos.',
    credit: 'Archivo fotográfico Nobsa · Felipe Acevedo (500px)',
  },
  {
    filename: 'ArbolNavidad.jpg',
    alt: 'Alumbrado navideño en Nobsa, Boyacá',
    caption: 'Temporada navideña y ruta de luces en la Provincia del Sugamuxi.',
    credit: 'Archivo cultural del proyecto Nobsa',
  },
];

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LightboxImageItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = useCallback((item: LightboxImageItem, gallery?: LightboxImageItem[]) => {
    const list = gallery && gallery.length > 0 ? gallery : NOBSA_GALLERY;
    const foundIdx = list.findIndex((g) => g.filename === item.filename);
    if (foundIdx >= 0) {
      setItems(list);
      setIndex(foundIdx);
    } else {
      setItems([item, ...list]);
      setIndex(0);
    }
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setIsOpen(false), []);

  const nextImage = useCallback(() => {
    setIndex((prev) => (items.length > 0 ? (prev + 1) % items.length : 0));
  }, [items.length]);

  const prevImage = useCallback(() => {
    setIndex((prev) => (items.length > 0 ? (prev - 1 + items.length) % items.length : 0));
  }, [items.length]);

  const value = useMemo<LightboxContextValue>(
    () => ({ isOpen, items, index, openLightbox, closeLightbox, nextImage, prevImage }),
    [isOpen, items, index, openLightbox, closeLightbox, nextImage, prevImage]
  );

  return <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>;
}

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox debe usarse dentro de LightboxProvider');
  return ctx;
}

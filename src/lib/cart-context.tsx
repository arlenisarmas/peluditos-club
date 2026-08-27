"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartLine, Product } from "@/lib/types";

const STORAGE_KEY = "che-peludos:cart";

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (slug: string, color?: string, size?: string) => void;
  updateQuantity: (slug: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(slug: string, color?: string, size?: string) {
  return [slug, color ?? "", size ?? ""].join("::");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // El servidor no tiene localStorage, así que el carrito arranca vacío en
    // el HTML de SSR a propósito y se hidrata acá, después del montaje, para
    // no generar un mismatch de hidratación con el markup del servidor.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación única desde localStorage, no un ciclo de sincronización
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // localStorage no disponible (SSR/incógnito): arrancamos con carrito vacío.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignorado: si no se puede persistir, el carrito sigue funcionando en memoria.
    }
  }, [lines, hydrated]);

  const addItem = useCallback(
    (product: Product, quantity = 1, color?: string, size?: string) => {
      setLines((prev) => {
        const key = lineKey(product.slug, color, size);
        const existing = prev.find((l) => lineKey(l.slug, l.color, l.size) === key);
        if (existing) {
          return prev.map((l) =>
            lineKey(l.slug, l.color, l.size) === key
              ? { ...l, quantity: l.quantity + quantity }
              : l
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.thumbnail,
            quantity,
            color,
            size,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((slug: string, color?: string, size?: string) => {
    const key = lineKey(slug, color, size);
    setLines((prev) => prev.filter((l) => lineKey(l.slug, l.color, l.size) !== key));
  }, []);

  const updateQuantity = useCallback(
    (slug: string, quantity: number, color?: string, size?: string) => {
      const key = lineKey(slug, color, size);
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((l) => lineKey(l.slug, l.color, l.size) !== key)
          : prev.map((l) =>
              lineKey(l.slug, l.color, l.size) === key ? { ...l, quantity } : l
            )
      );
    },
    []
  );

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({ lines, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }),
    [lines, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

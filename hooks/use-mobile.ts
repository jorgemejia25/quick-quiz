import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile
 * Indica si el dispositivo es móvil.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  /**
   * useEffect
   * Indica si el dispositivo es móvil.
   */
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    /**
     * onChange
     * Maneja el cambio de tamaño de la ventana.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    /**
     * addEventListener
     * Agrega un listener para el cambio de tamaño de la ventana.
     */
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

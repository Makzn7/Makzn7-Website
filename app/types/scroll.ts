export interface LenisInstance {
  on(event: string, callback: (...args: unknown[]) => void): void;
  resize?(): void;
}

export interface LocomotiveScrollInstance {
  lenisInstance?: LenisInstance;
  destroy(): void;
  stop(): void;
  start(): void;
}

export interface LocomotiveScrollConstructorOptions {
  el: HTMLElement;
  smooth: boolean;
  lerp: number;
  multiplier: number;
  smartphone?: { smooth: boolean };
  tablet?: { smooth: boolean };
}

export type LocomotiveScrollConstructor = new (
  options: LocomotiveScrollConstructorOptions
) => LocomotiveScrollInstance;

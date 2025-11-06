declare module '@deck.gl/core/src/types/types' {
  export interface ConstructorOf<T> {
    new (...args: any[]): T;
  }
}

declare module '@deck.gl/core/src/utils/flatten' {
  export function fillArray(options: {
    target: any;
    source: any;
    start?: number;
    count?: number;
  }): void;
}

declare module '@deck.gl/core/src/utils/math-utils' {
  export function toDoublePrecisionArray(
    array: any,
    options?: any,
  ): Float32Array;
}

declare module '@deck.gl/core/src/views/view' {
  export interface TransitionProps {
    [key: string]: any;
  }

  export interface ViewState {
    [key: string]: any;
  }
}

declare module '@deck.gl/core' {
  export interface ConstructorOf<T> {
    new (...args: any[]): T;
  }
}

declare module '@deck.gl/*' {
  const content: any;
  export = content;
}

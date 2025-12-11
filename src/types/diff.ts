export type Diff<T, U> = Omit<T, keyof T & keyof U>;

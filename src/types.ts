
export interface CommonMethods<T> {
  len?(item: T): number,
  cloneItem?(item: T): T,
}

export interface MergeMethods<T> extends CommonMethods<T> {
  // canAppend(into: T, from: T): boolean,
  // append(into: T, from: T): void,

  /**
   * Try and append from to the end of to. Returns true if
   * this is successful. False if not. If this method returns
   * false, the items must not be modified.
   */
  tryAppend(a: T, b: T): boolean,

  // tryPrepend as an optimization.
}

export interface SplitMethods<T> extends CommonMethods<T> {
  /**
   * Offset must be between 1 and item len -1. The item is truncated
   * in-place.
   */
  truncateKeepingLeft(item: T, offset: number): void,
  truncateKeepingRight(item: T, offset: number): void,
  // split?(item: T, offset: number): [T, T],
}

export interface Keyed<T> extends CommonMethods<T> {
  keyStart(item: T): number,
  keyEnd(item: T): number,
}

export type AllRLEMethods<T> = MergeMethods<T> & SplitMethods<T> & Keyed<T>


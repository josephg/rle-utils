// This file exports 2 simple RLE types: SimpleRLESpan and SimpleKeyedSpan. They can be used to
// store simple RLE lists of items.

import { AllRLEMethods, MergeMethods, SplitMethods } from "./types.js"

export type SimpleRLESpan<T> = { val: T, length: number }

export const simpleSpanRLE: MergeMethods<SimpleRLESpan<any>> & SplitMethods<SimpleRLESpan<any>> = {
  // len: (item) => item.length,
  tryAppend(to, from) {
    if (to.val === from.val) {
      to.length += from.length
      return true
    } else return false
  },
  truncateKeepingLeft(item, offset) { item.length = offset },
  truncateKeepingRight(item, offset) { item.length -= offset },
  cloneItem: ({val, length}) => ({ val, length })
}

export type SimpleKeyedSpan<T> = { key: number } & SimpleRLESpan<T>

export const simpleKeyedSpanRLE: AllRLEMethods<SimpleKeyedSpan<any>> = {
  // len: (item) => item.length,
  keyStart: item => item.key,
  keyEnd: item => item.key + item.length,
  tryAppend(to, from) {
    if (to.val === from.val && to.key + to.length === from.key) {
      to.length += from.length
      return true
    } else return false
  },
  truncateKeepingLeft(item, offset) { item.length = offset },
  truncateKeepingRight(item, offset) {
    item.length -= offset
    item.key += offset
  },
  cloneItem: ({val, length, key}) => ({ val, length, key })
}

/**
 * This is a special type of run-length encoded item which maps from key ranges to value ranges.
 *
 * keyStart -> val,
 * keyStart + 1 -> val + 1,
 * and so on.
 */
export type IndexedMap = {
  keyStart: number,
  keyEnd: number,
  val: number
}

export const indexedMapRLE: AllRLEMethods<IndexedMap> = {
  // len(item) { return item.seqEnd - item.seq },
  keyStart: e => e.keyStart,
  keyEnd: e => e.keyEnd,
  tryAppend(a, b) {
    if (b.keyStart === a.keyEnd
      && b.val === (a.val + (a.keyEnd - a.keyStart))
    ) {
      a.keyEnd = b.keyEnd
      return true
    } else return false
  },
  truncateKeepingLeft(item, offset) {
    item.keyEnd = item.keyStart + offset
  },
  truncateKeepingRight(item, offset) {
    item.keyStart += offset
    item.val += offset
  }
}